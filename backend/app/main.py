from flask import Flask, jsonify, request, redirect, make_response
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_cors import CORS
from flask_restful import Api, Resource
from pymongo import MongoClient
from datetime import timedelta
import os
import bcrypt
import base64
import re

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['PROPAGATE_EXCEPTIONS'] = True
api = Api(app)
app.config["JWT_SECRET_KEY"] = os.getenv('JWT_SECRET')
jwt = JWTManager(app)
client = MongoClient("mongodb://db:27017")
db = client.get_database('app')
users = db['users']


class Home(Resource):
    def get(self):
        response = jsonify({"msg":"Hello Guest", "status":200})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


class Login(Resource):

    def post(self):
        username = request.json.get("username")
        password = request.json.get("password")
        if not username or not password:
            response = jsonify({
                "msg": "Username and password are required",
                "status": 400
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        existing_user = users.find_one({"username": username})
        existing_hashed_pw = existing_user.get("password")
        if bcrypt.checkpw(password.encode('utf8'), existing_hashed_pw):
            access_token = create_access_token(identity=username)
            response = make_response(jsonify({"msg": "Logged in", "status": 200}))
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.set_cookie('access_token', access_token, httponly=True, secure=True, samesite='Lax')
            return response

        response = jsonify({"msg": "password is incorrect", "status": 401})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


class Profile(Resource):

    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        response = jsonify({"msg": f"Welcome {current_user}", "status": 200})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


class Register(Resource):

    def post(self):
        username = request.json.get("username")
        password = request.json.get("password")
        if not username or not password:
            response = jsonify({
                "msg": "Username and password are required",
                "status": 400
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        pattern =  r'^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}|:"<>?`~\-=;\',.\/])[A-Za-z0-9!@#$%^&*()_+{}|:"<>?`~\-=;\',.\/]{8,}$'
        pw = re.fullmatch(pattern, password)
        if pw:
            hashed_pw = bcrypt.hashpw(password.encode('utf8'), bcrypt.gensalt())
            existing_user = users.find_one({"username": username})
            if existing_user:
                response = jsonify({
                    "msg": "User already registered",
                    "status": 302
                })
                response.headers.add('Access-Control-Allow-Origin', '*')
                return response
            users.insert_one({"username": username, "password": hashed_pw})
            access_token = create_access_token(identity=username)
            response = jsonify({
                "message": f"User {username} created",
                "status": 200,
                "token": access_token
            })
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        response = jsonify({
            "msg":
            "Password should be 8 characters long with 1 capital letter, 1 number and 1 special charachter",
            "status": 401
        })
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


api.add_resource(Home, '/')
api.add_resource(Login, '/login')
api.add_resource(Profile, '/profile')
api.add_resource(Register, '/register')

if __name__ == '__main__':
    app.run()
