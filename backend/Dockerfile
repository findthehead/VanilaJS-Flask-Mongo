FROM python:3.12
WORKDIR /backend
COPY . .
EXPOSE 8000
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r app/requirements.txt
CMD ["flask", "--app", "app/main", "run", "--host", "0.0.0.0", "--port", "8000"]

