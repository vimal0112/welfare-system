from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

model = joblib.load("../data/processed/welfare_decision_tree_model.pkl")
encoders = joblib.load("../data/processed/encoders.pkl")

# 🔒 EXACT training order (replace if your print shows different)
FEATURE_ORDER = [
    "age",
    "gender",
    "category",
    "state",
    "occupation",
    "annual_income",
    "disability",
    "is_minority"
]

def safe_label_encode(series, encoder):
    series = series.astype(str)
    return series.apply(
        lambda x: encoder.transform(["Unknown"])[0]
        if x not in encoder.classes_
        else encoder.transform([x])[0]
    )

@app.route("/predict", methods=["POST"])
def predict_score():
    data = request.json
    df = pd.DataFrame([data])

    for col in FEATURE_ORDER:
        if col not in df:
            df[col] = "Unknown"

    for col, encoder in encoders.items():
        if col in df:
            df[col] = safe_label_encode(df[col], encoder)

    df = df.loc[:, FEATURE_ORDER]

    score = model.predict_proba(df)[0][1]

    return jsonify({
        "eligibility_score": float(score)
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)
