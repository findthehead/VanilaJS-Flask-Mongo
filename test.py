import requests

url = "https://localhost:8000"

data = {
  'username': 'lizz',
  'password': '@Passsdsd2'
}

header ={ "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcyNDE1NjQ1NSwianRpIjoiODRmYjhlYjUtMjQwOS00NjhlLWFmZjUtZjcyYjM0MDcxOWNmIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6IlRvbSIsIm5iZiI6MTcyNDE1NjQ1NSwiY3NyZiI6IjQ2OTE0MWE5LThlNjQtNGQwNC1hZjk3LTU2NDcxMzk3N2RhMyIsImV4cCI6MTcyNDE1NzM1NX0.gLQrxP79Qb1TGZOTam_bV-DsZBRLaeOrqNLJ-_3HvCk"
}


def test():
  check = requests.post(url+"/login", json=data)
  print(check.text)
  print(check.cookies)


if __name__=='__main__':
  test()