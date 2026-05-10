import json
from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    confusion_matrix,
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_curve,
    auc,
)
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = (BASE_DIR / "../data/raw/ml_training_dataset.csv").resolve()
OUTPUT_DIR = (BASE_DIR / "../outputs").resolve()
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FEATURES = [
    "age",
    "gender",
    "category",
    "state",
    "occupation",
    "annual_income",
    "disability",
    "is_minority",
]
CATEGORICAL_COLS = [
    "gender",
    "category",
    "state",
    "occupation",
    "disability",
    "is_minority",
]

RANDOM_STATE = 42


def load_data():
    df = pd.read_csv(DATA_PATH)
    df = df.copy()
    df["eligible"] = df["eligible"].map({"Yes": 1, "No": 0})
    return df


def encode_features(df):
    df = df.copy()
    encoders = {}
    for col in CATEGORICAL_COLS:
        le = LabelEncoder()
        df[col] = df[col].astype(str)
        values = df[col].tolist()
        values.append("Unknown")
        le.fit(values)
        df[col] = le.transform(df[col])
        encoders[col] = le
    return df, encoders


def train_models(X_train, y_train):
    dt = DecisionTreeClassifier(random_state=RANDOM_STATE)
    rf = RandomForestClassifier(n_estimators=200, random_state=RANDOM_STATE)

    dt.fit(X_train, y_train)
    rf.fit(X_train, y_train)

    return dt, rf


def evaluate_model(model, X_train, y_train, X_test, y_test):
    y_train_pred = model.predict(X_train)
    y_test_pred = model.predict(X_test)

    if hasattr(model, "predict_proba"):
        y_test_proba = model.predict_proba(X_test)[:, 1]
    else:
        y_test_proba = y_test_pred

    metrics = {
        "train_accuracy": accuracy_score(y_train, y_train_pred),
        "test_accuracy": accuracy_score(y_test, y_test_pred),
        "precision": precision_score(y_test, y_test_pred, zero_division=0),
        "recall": recall_score(y_test, y_test_pred, zero_division=0),
        "f1": f1_score(y_test, y_test_pred, zero_division=0),
    }

    fpr, tpr, _ = roc_curve(y_test, y_test_proba)
    metrics["auc"] = auc(fpr, tpr)
    metrics["confusion_matrix"] = confusion_matrix(y_test, y_test_pred).tolist()

    return metrics, (fpr, tpr)


def plot_confusion_matrix(cm, title, path):
    plt.figure(figsize=(4.2, 3.6))
    plt.imshow(cm, interpolation="nearest", cmap=plt.cm.Blues)
    plt.title(title)
    plt.colorbar()
    tick_marks = np.arange(2)
    plt.xticks(tick_marks, ["Not Eligible", "Eligible"], rotation=15)
    plt.yticks(tick_marks, ["Not Eligible", "Eligible"])
    thresh = np.max(cm) / 2.0
    for i in range(cm.shape[0]):
        for j in range(cm.shape[1]):
            plt.text(
                j,
                i,
                format(cm[i, j], "d"),
                ha="center",
                va="center",
                color="white" if cm[i, j] > thresh else "black",
            )
    plt.ylabel("Actual")
    plt.xlabel("Predicted")
    plt.tight_layout()
    plt.savefig(path, dpi=140)
    plt.close()


def plot_roc_curve(curves, path):
    plt.figure(figsize=(5.2, 4.0))
    for label, (fpr, tpr, auc_score) in curves:
        plt.plot(fpr, tpr, label=f"{label} (AUC={auc_score:.3f})")
    plt.plot([0, 1], [0, 1], "k--", linewidth=1)
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title("ROC Curve")
    plt.legend(loc="lower right")
    plt.tight_layout()
    plt.savefig(path, dpi=140)
    plt.close()


def plot_feature_importance(feature_names, importances, title, path):
    order = np.argsort(importances)[::-1]
    sorted_features = [feature_names[i] for i in order]
    sorted_importances = importances[order]

    plt.figure(figsize=(6.2, 4.2))
    plt.barh(sorted_features[::-1], sorted_importances[::-1], color="#2a6f97")
    plt.title(title)
    plt.xlabel("Importance")
    plt.tight_layout()
    plt.savefig(path, dpi=140)
    plt.close()


def main():
    df = load_data()
    df_encoded, _ = encode_features(df)

    X = df_encoded[FEATURES]
    y = df_encoded["eligible"]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=y,
    )

    dt, rf = train_models(X_train, y_train)

    dt_metrics, dt_curve = evaluate_model(dt, X_train, y_train, X_test, y_test)
    rf_metrics, rf_curve = evaluate_model(rf, X_train, y_train, X_test, y_test)

    # Plots
    plot_confusion_matrix(
        np.array(dt_metrics["confusion_matrix"]),
        "Decision Tree - Confusion Matrix",
        OUTPUT_DIR / "confusion_matrix_decision_tree.png",
    )
    plot_confusion_matrix(
        np.array(rf_metrics["confusion_matrix"]),
        "Random Forest - Confusion Matrix",
        OUTPUT_DIR / "confusion_matrix_random_forest.png",
    )

    plot_roc_curve(
        [
            ("Decision Tree", (dt_curve[0], dt_curve[1], dt_metrics["auc"])),
            ("Random Forest", (rf_curve[0], rf_curve[1], rf_metrics["auc"])),
        ],
        OUTPUT_DIR / "roc_curve.png",
    )

    plot_feature_importance(
        FEATURES,
        dt.feature_importances_,
        "Decision Tree - Feature Importance",
        OUTPUT_DIR / "feature_importance_decision_tree.png",
    )

    plot_feature_importance(
        FEATURES,
        rf.feature_importances_,
        "Random Forest - Feature Importance",
        OUTPUT_DIR / "feature_importance_random_forest.png",
    )

    # Summary stats
    summary = {
        "dataset": {
            "rows": int(df.shape[0]),
            "columns": int(df.shape[1]),
            "features": FEATURES,
            "target": "eligible",
            "class_distribution": df["eligible"].value_counts().to_dict(),
        },
        "decision_tree": dt_metrics,
        "random_forest": rf_metrics,
    }

    with open(OUTPUT_DIR / "metrics_summary.json", "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2)

    print("Reports and plots generated in", OUTPUT_DIR)


if __name__ == "__main__":
    main()
