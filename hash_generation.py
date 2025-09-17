from eth_utils import keccak


def make_commit(choice, nonce):
    if isinstance(choice, int):
        choice_byte = choice.to_bytes(1, byteorder='big')
    else:
        raise ValueError("Choice must be int 0 or 1")
    
    packed = choice_byte + nonce  # 1 + 32 bytes
    return keccak(packed).hex()

import os
nonce = os.urandom(32)
commit0 = make_commit(0, nonce)
commit1 = make_commit(1, nonce)

print("Nonce hex (keep safe):", nonce.hex())
print("Commit0:", commit0)
print("Commit1:", commit1)
