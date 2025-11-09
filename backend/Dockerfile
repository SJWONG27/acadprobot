FROM continuumio/miniconda3

WORKDIR /app

COPY environment.yml .
RUN conda env create -f environment.yml

SHELL ["conda", "run", "-n", "base", "/bin/bash", "-c"]

COPY . .
COPY /academic_classifier_bert /app/academic_classifier_bert

EXPOSE 8080
CMD ["bash", "-c", "source activate acadprobot && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

# CMD ["conda", "run", "-n", "base", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
