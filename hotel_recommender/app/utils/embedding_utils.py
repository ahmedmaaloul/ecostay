import torch
from transformers import RobertaTokenizer, RobertaModel
import numpy as np

MODEL_NAME = "roberta-base"
tokenizer = RobertaTokenizer.from_pretrained(MODEL_NAME)
model = RobertaModel.from_pretrained(MODEL_NAME)
model.eval()

def roberta_encode(text: str) -> np.ndarray:
    inputs = tokenizer(text, return_tensors='pt', truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        last_hidden_state = outputs.last_hidden_state.squeeze(0)
        embedding = torch.mean(last_hidden_state, dim=0).numpy()
    return embedding
