from fastapi import FastAPI, File, UploadFile
import cv2
import numpy as np
import tempfile
import os
from keras_facenet import FaceNet
from scipy.spatial.distance import cosine
from fastapi.responses import JSONResponse
from transformers import AutoImageProcessor, AutoModelForImageClassification
import torch
from PIL import Image

app = FastAPI()
embedder = FaceNet()
embedding_modelo = np.load('embedding_modelo.npy')

# Carregar o modelo de liveness
liveness_model_name = "nguyenkhoa/vit_Liveness_detection_v1.0"
liveness_processor = AutoImageProcessor.from_pretrained(liveness_model_name)
liveness_model = AutoModelForImageClassification.from_pretrained(liveness_model_name)

# Se você tiver GPU disponível
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
liveness_model = liveness_model.to(device)

@app.post("/detect")
async def detect_face_without_crop(file: UploadFile = File(...)):
    # Salvar o vídeo temporariamente
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_video:
        temp_video.write(await file.read())
        video_path = temp_video.name

    try:
        cap = cv2.VideoCapture(video_path)
        frames = []
        liveness_scores = []
        
        # Processar frames do vídeo
        max_frames = 15
        frame_count = 0
        
        while cap.isOpened() and frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
                
            # Converter para RGB
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            frames.append(rgb_frame)
            
            # Verificar liveness a cada 3 frames para velocidade
            if frame_count % 3 == 0:
                # Converter para formato PIL - FRAME COMPLETO SEM RECORTE
                pil_image = Image.fromarray(rgb_frame)
                
                # Processar frame completo para liveness detection
                inputs = liveness_processor(images=pil_image, return_tensors="pt")
                inputs = {k: v.to(device) for k, v in inputs.items()}
                
                # Fazer inferência
                with torch.no_grad():
                    outputs = liveness_model(**inputs)
                    probabilities = torch.nn.functional.softmax(outputs.logits, dim=1)
                
                # Verificar mapeamento de classes
                id2label = getattr(liveness_model.config, 'id2label', {0: 'fake', 1: 'real'})
                print(f"Mapeamento de classes: {id2label}")
                
                # Classe 0 = real (live), Classe 1 = falso (spoof)
                real_prob = probabilities[0][0].item()  # Probabilidade de ser real
                print(f"Frame {frame_count} (sem recorte): Probabilidade de ser real: {real_prob:.4f}")
                liveness_scores.append(real_prob)
            
            frame_count += 1
        
        cap.release()
        os.unlink(video_path)  # Limpar o arquivo temporário
        
        # Determinar liveness usando modelo
        is_live = False
        confidence = 0.0
        
        if liveness_scores:
            # Usar o score máximo como confidence
            confidence = max(liveness_scores)
            print(f"Confiança máxima (sem recorte): {confidence:.4f}")
            # Considerar vivo se pelo menos um frame tem confiança alta
            is_live = confidence > 0.5  # Ajuste este limiar conforme necessário
            print(f"É liveness (sem recorte): {is_live}")
        else:
            print("Nenhum score de liveness foi calculado")
        
        # Reconhecimento facial no melhor frame
        best_similarity = 0
        for frame in frames:
            rostos = embedder.extract(frame, threshold=0.95)
            for rosto in rostos:
                emb = rosto['embedding']
                distancia = cosine(embedding_modelo, emb)
                similarity = 1 - distancia
                best_similarity = max(best_similarity, similarity)
        
        return {
            "similarity": float(best_similarity),
            "is_live": bool(is_live),
            "confidence": float(confidence),
            "method": "without_crop"
        }
        
    except Exception as e:
        print("Erro ao processar vídeo:", e)
        import traceback
        traceback.print_exc()
        return JSONResponse(
            {"similarity": 0, "is_live": False, "error": str(e), "method": "without_crop"}, 
            status_code=500
        )