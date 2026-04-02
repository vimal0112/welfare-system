import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
import joblib

# Load dataset
df = pd.read_csv("../data/raw/ml_training_dataset.csv")

# Target encoding
df['eligible'] = df['eligible'].map({'Yes': 1, 'No': 0})

categorical_cols = [
    'gender',
    'category',
    'state',
    'occupation',
    'disability',
    'is_minority'
]

feature_cols = [
    'age',
    'gender',
    'category',
    'state',
    'occupation',
    'annual_income',
    'disability',
    'is_minority'
]

X = df[feature_cols]
y = df['eligible']

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    X_train[col] = X_train[col].astype(str)
    X_test[col] = X_test[col].astype(str)

    values = X_train[col].tolist()
    values.append("Unknown")

    le.fit(values)
    X_train[col] = le.transform(X_train[col])

    X_test[col] = X_test[col].apply(
        lambda x: le.transform(["Unknown"])[0] if x not in le.classes_ else le.transform([x])[0]
    )

    encoders[col] = le

model = DecisionTreeClassifier(random_state=42)

model.fit(X_train, y_train)

joblib.dump(model, "../data/processed/welfare_decision_tree_model.pkl")
joblib.dump(encoders, "../data/processed/encoders.pkl")

print("Model trained and saved successfully")
