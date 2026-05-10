# Government Welfare Advisory System - ML Model

Machine learning service for eligibility prediction. This model powers the `/api/welfare/check-eligibility` flow in the backend.

## Folder Structure
- `api/` Flask/FastAPI service (if present)
- `data/` training data
- `models/` saved model artifacts
- `notebooks/` experimentation notebooks
- `src/` training/inference scripts
- `requirements.txt` Python dependencies

## Setup

```bash
cd ml-model
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Run API (if available)
Check `ml-model/api` for the server script. Typical command:

```bash
python api/app.py
```

## Training (optional)
Look in `ml-model/src` or `ml-model/notebooks` for training scripts. If training is needed, update the model file in `ml-model/models`.

## Model Choice: Why Use a Decision Tree
Even if a Random Forest performs slightly better, a Decision Tree is often chosen in government welfare systems because:
- **Explainable decisions**: You can trace the exact rule path for each prediction (useful for audits and citizen appeals).
- **Policy transparency**: Single-tree logic is easier to document and review than an ensemble of hundreds of trees.
- **Compliance**: Clear reasoning is crucial when outcomes affect benefits and legal accountability.
- **Small performance gap**: If accuracy/ROC differences are minor, transparency can outweigh the extra performance.

Use **Random Forest** when maximizing predictive performance is the top priority. Use **Decision Tree** when interpretability and accountability are required.

## Integration Notes
The backend calls the ML service at:

```text
http://127.0.0.1:5000/predict
```

If you change the ML server port or URL, update:

- `backend/src/main/java/com/project/welfare/service/MlService.java`

## Inputs / Outputs
The model expects:
- `age`
- `gender`
- `category`
- `state`
- `occupation`
- `annual_income`
- `disability`
- `is_minority`

The response returns:
- `eligibility_score`

