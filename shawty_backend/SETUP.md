# Shawty backend (Django + DRF)

python -m venv venv
venv\Scripts\activate          # Windows   (Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt
python manage.py makemigrations shop
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver     # http://localhost:8000

Add products at http://localhost:8000/admin (Shop > Products).
API root: http://localhost:8000/api/
