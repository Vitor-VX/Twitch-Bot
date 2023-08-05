# Twitch Bot
Chat Bot para Twitch - Um bot de bate-papo interativo para a plataforma Twitch, desenvolvido em Node.js utilizando a biblioteca tmi.js. O bot permite interações com os espectadores durante a transmissão, com jogos e comandos personalizados.

## Descrição
Esse bot é um Chat Bot interativo para a plataforma Twitch, focado em proporcionar jogos e interações divertidas para os espectadores durante as transmissões. Atualmente, o bot conta com quatro jogos, mas está em constante desenvolvimento e novos jogos e recursos serão adicionados em um futuro próximo.

## Info próxima atualização
Será implementado o banco de dados MongoDB na próxima atualização do Bot, para manter os comandos/Gerenciar os jogos.

## Jogos Disponíveis
- Jogo 1: [Black Jack - 21]
- Jogo 2: [Jogo da forca]
- Jogo 3: [Adivinhar Números de 2-19]
- Jogo 4: [Anagramas - Palavras ao-contrário]
- Jogo 5: [Acertar a soma dos números]
- -> [MAIS JOGOS EM BREVE]

## Integração com o MongoDB
Na próxima atualização, o Twitch Bot integrará o banco de dados MongoDB para gerenciar comandos e jogos de maneira eficaz. O banco de dados permitirá armazenar e recuperar informações, tornando mais fácil adicionar, atualizar e remover comandos e jogos personalizados. Essa integração aprimorará a funcionalidade do bot e proporcionará uma experiência mais dinâmica tanto para os transmissores quanto para os espectadores.

```makefile
TWITCH_USERNAME=seu_nome_de_usuário_do_twitch
TWITCH_TOKEN=seu_token_oauth_do_twitch
TWITCH_CHANNEL=seu_canal_do_twitch
MONGODB_USER=seu_user_mongodb
MONGODB_PASSWORD=sua_senha_mongodb
```

## Instalação
1. Clone este repositório em sua máquina local.
2. Instale as dependências usando o gerenciador de pacotes [npm](https://www.npmjs.com/):

```bash
npm install
