1️⃣ Propósito

Este site é uma galeria multimídia protegida, onde cada usuário pode:

Criar seu próprio login e senha.

Ter sua galeria privada com fotos e vídeos.

Decidir se cada item será protegido por senha (blur) ou já ficará visível diretamente.

Alternar entre temas de cores (escuro, cinza e claro).

2️⃣ Funcionalidades principais
Login e Cadastro

Login: Usuários existentes podem entrar usando seu nome de usuário e senha.

Cadastro: Novos usuários podem criar login e senha.

Cada usuário tem sua própria galeria separada, isolada das galerias de outros usuários.

Galeria

Fotos e vídeos: Cada usuário pode adicionar arquivos de mídia à sua galeria.

Blur/Proteção: É possível definir se um arquivo estará protegido com blur e senha ou já ficará visível.

Modal: Ao clicar em uma foto ou vídeo, ele abre em modal com visualização maior.

Navegação: Setas permitem navegar pelos itens da galeria dentro do modal.

Upload

Usuário pode enviar fotos e vídeos diretamente do computador.

Arquivos são convertidos para Base64 e armazenados no localStorage, garantindo que eles permaneçam salvos mesmo após fechar ou reiniciar o navegador.

Proteção de mídia

Itens com blur exigem que o usuário digite a senha para visualizar o conteúdo.

Após inserir a senha correta, o blur é removido temporariamente e o item fica visível.

Tema

Botão flutuante no canto superior direito permite alternar entre modo escuro, cinza e claro.

O tema afeta cores do fundo, texto, inputs e botões, proporcionando melhor experiência visual.

3️⃣ Armazenamento

LocalStorage: Guarda usuários, senhas e galerias (fotos/vídeos em Base64).

Cada usuário tem sua própria entrada no localStorage, garantindo privacidade das mídias.

4️⃣ Experiência do Usuário

Login ou cadastro: Usuário acessa ou cria sua conta.

Upload de mídia: Envia fotos ou vídeos, definindo se estarão protegidos.

Visualização: Clica no item para abrir no modal; se protegido, digita senha.

Tema: Pode alternar facilmente entre cores usando o botão flutuante.

Persistência: Todos os arquivos permanecem salvos mesmo após fechar o navegador.

5️⃣ Tecnologias utilizadas

HTML/CSS: Estrutura e estilo, incluindo temas dinâmicos e modal.

JavaScript:

Gerenciamento de login/cadastro.

Upload e armazenamento em Base64.

Modal de visualização de fotos e vídeos.

Controle de blur/segurança.

Alternância de temas.
