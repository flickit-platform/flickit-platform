import random
import string


def create_new_code_number():
    res = ''.join(random.choices(string.ascii_uppercase +
                                    string.digits, k=20))
    return str(res)
