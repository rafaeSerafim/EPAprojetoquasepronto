from pydantic import BaseModel, field_validator

class Curiosidade (BaseModel):
    titulo: str
    descricao: str

    @field_validator('titulo')
    def validar_titulo(cls, value):
        palavras = value.split(' ')
        if len(palavras) < 3:
            raise ValueError("O título deve ter pelo menos 3 palavras.")

        return value