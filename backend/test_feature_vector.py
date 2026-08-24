from app.utils.feature_vector import (
    serialize_feature_vector,
    deserialize_feature_vector,
)

vector = [1.2, 2.5, 3.7]

json_vector = serialize_feature_vector(vector)

print(json_vector)

restored = deserialize_feature_vector(json_vector)

print(restored)

print(type(restored))