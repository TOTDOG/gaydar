import os
import torch
import psycopg2
from contextlib import asynccontextmanager
from fastapi import FastAPI, Header, HTTPException
from huggingface_hub import snapshot_download

from model import ModularTransformer, DEVICE
from dataset import ParameterRegistry

model = None
param_registry = None


def download_weights():
    try:
        snapshot_download(
            repo_id=os.environ['HF_REPO_ID'],
            repo_type='model',
            local_dir='/app/weights',
            token=os.environ['HF_TOKEN']
        )
        print("Downloaded weights from Hugging Face")
    except Exception as e:
        print(f"No weights found, starting without: {e}")


def fetch_parameters():
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute('''
        SELECT id, name, type, active, classes, min, max, description
        FROM "Parameter"
        WHERE active = true
    ''')
    cols = [d[0] for d in cur.description]
    parameters = [dict(zip(cols, row)) for row in cur.fetchall()]
    cur.close()
    conn.close()
    return parameters


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, param_registry

    parameters = fetch_parameters()
    param_registry = ParameterRegistry(parameters)
    model = ModularTransformer()
    model.registry.register_all(parameters)
    
    download_weights()  # non-fatal, skips if repo is empty
    model.load()        # non-fatal, skips if no file found
    model.eval()

    yield


app = FastAPI(lifespan=lifespan)


@app.post("/score")
async def score(
    set_parameters: list[dict],
    authorization: str = Header(None)
):
    if authorization != f"Bearer {os.environ['API_SECRET']}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    if model is None:
        raise HTTPException(status_code=503, detail="Model not yet trained")

    scenario = param_registry.parse_set_parameters(set_parameters)
    if not scenario:
        raise HTTPException(status_code=400, detail="No valid parameters in request")

    with torch.no_grad():
        result = model(scenario)

    return {"score": result.item()}


@app.get("/health")
async def health():
    return {"status": "ok"}