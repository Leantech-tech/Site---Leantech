# Imagem leve do nginx para servir site estático
FROM nginx:alpine

# Remove a página padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos do site para o diretório do nginx
COPY . /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Inicia o nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]
