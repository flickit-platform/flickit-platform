from cryptography.fernet import Fernet
from assessmentplatform.settings import TOKEN_KEY


def encrypt_message(message):
    encoded_message = message.encode()
    f = Fernet(TOKEN_KEY)
    print(encoded_message)
    encrypted_mesage = f.encrypt(encoded_message)
    print(encrypted_mesage)
    print(encrypted_mesage.decode())
    return encrypted_mesage.decode()


def decrypt_message(encrypted_message):
    f = Fernet(TOKEN_KEY)
    print(encrypted_message)
    return f.decrypt(encrypted_message.encode())
