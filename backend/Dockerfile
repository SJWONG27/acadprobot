FROM continuumio/miniconda3

WORKDIR /app

COPY environment.yml .
RUN conda env create -f environment.yml

# SHELL ["conda", "run", "-n", "base", "/bin/bash", "-c"]
SHELL ["bash", "-lc"]


# RUN conda run -n acadprobot playwright install chromium 
# RUN conda run -n acadprobot playwright install-deps 
RUN conda activate acadprobot && \
    playwright install chromium && \
    playwright install-deps


COPY . .
# COPY /academic_classifier_bert /app/academic_classifier_bert
# COPY academic_classifier_bert /app/academic_classifier_bert

RUN apt-get update && apt-get install -y cmake build-essential

RUN conda activate acadprobot && \
    git clone https://github.com/ggml-org/whisper.cpp.git \
    && cd whisper.cpp \
    && sh ./models/download-ggml-model.sh base.en \
    && cmake -B build \
    && cmake --build build -j --config Release 


EXPOSE 8080
CMD ["bash", "-c", "source activate acadprobot && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

# CMD ["conda", "run", "-n", "base", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
