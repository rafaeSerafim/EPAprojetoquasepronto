from typing import Dict
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import status
from models import Curiosidade   

from fastapi.middleware.cors import CORSMiddleware

api = FastAPI(
    title='API cursos', version='0.0.1', description='Uma API de cursos para estudo do FastAPI'
)

api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://127.0.0.1:5501"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

curiosidades = {
    1: {
        'titulo': " A equação de Drake",
        'descricao': "O astrônomo Frank Drake criou uma fórmula para estimar quantas civilizações inteligentes podem existir na Via Láctea. Mesmo com dados incertos, a equação sugere que pode haver milhares de civilizações!"
    },
    2: {
        'titulo': " Existem mais planetas do que estrelas",
        'descricao': "Estudos mostram que há pelo menos um planeta para cada estrela da galáxia — e muitos deles estão na chamada 'zona habitável', onde pode existir água líquida."
    },
    3: {
        'titulo': " A busca por tecnossinaturas",
        'descricao': "Os cientistas não procuram só sinais de vida biológica, mas também sinais de tecnologia, como ondas de rádio ou poluição atmosférica artificial — possíveis evidências de civilizações avançadas."
    },
    4: {
        'titulo': " Marte já teve rios e oceanos",
        'descricao': "O planeta vermelho já teve água em abundância há bilhões de anos. Alguns pesquisadores acreditam que formas de vida microbiana podem ter existido (ou ainda existir) embaixo da superfície."
    },
    5: {
        'titulo': " Aminoácidos no espaço",
        'descricao': "Moléculas essenciais para a vida, como aminoácidos e açúcares, já foram encontradas em meteoritos e cometas, mostrando que os 'blocos da vida' são comuns no cosmos."
    },
    6: {
        'titulo': " A vida pode ter vindo de fora",
        'descricao': "A teoria da panspermia sugere que a vida na Terra pode ter se originado em outro planeta e chegado aqui através de meteoritos ou poeira cósmica."
    },
    7: {
        'titulo': " A Terra é 'estranha'",
        'descricao': "Apesar de parecer comum pra nós, a Terra tem uma combinação rara: água líquida, atmosfera estável e campo magnético protetor — o que pode ser raro em outros mundos."
    },
    8: {
        'titulo': " Já detectamos planetas 'irmãos' da Terra",
        'descricao': "Astrônomos já identificaram exoplanetas parecidos com a Terra, como Kepler-452b e Proxima Centauri b, que podem ter condições para a vida."
    },
    9: {
        'titulo': " Extremófilos: vida em condições impossíveis",
        'descricao': "Na Terra, há seres vivos que sobrevivem em vulcões, no fundo dos oceanos e até em radiação intensa. Isso mostra que a vida pode existir em ambientes extremos de outros planetas também."
    },
    10: {
        'titulo': " Missões espaciais buscam bioassinaturas",
        'descricao': "Sondas como a Perseverance (em Marte) e a futura Europa Clipper (lua de Júpiter) estão em busca de sinais químicos que indiquem vida — passada ou presente."
    },
    11: {
        'titulo': " O paradoxo de Fermi",
        'descricao': "Se o universo é tão vasto e antigo, por que ainda não encontramos sinais de vida extraterrestre? Esse é o paradoxo de Fermi, que questiona a aparente contradição entre a alta probabilidade de vida em outros lugares e a falta de evidências para isso."
    },
    12: {
    'titulo': "A vida pode ser totalmente diferente da nossa",
    'descricao': "Nem toda vida precisa de água e carbono. Alguns cientistas acreditam que pode existir vida baseada em silício ou amônia, invisível aos nossos padrões de detecção."
}    
}

@api.get('/curiosidades', description='Retorna todos os curiosidades ou uma lista vazia' ,summary='Retorna todos os curiosidades',response_model=Dict[int, Curiosidade  ])
async def get_curiosidades():
    return curiosidades

@api.get('/curiosidades/{curiosidade_id}')
async def get_curiosidades(curiosidade_id: int):
    try: 
        curiosidade = curiosidades[curiosidade_id]
        return curiosidade
    except KeyError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Curiosidade não encontrada') 




if __name__ == '__main__':
    import uvicorn 

    uvicorn.run('main:api', host='127.0.0.1', port=8000, log_level='info', reload=True)

