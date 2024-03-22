from flask import Flask, render_template, request, redirect
import pyodbc

app = Flask(__name__)

# Configurações de conexão com o banco de dados SQL Server
server = 'Transferencia'
database = 'cadastro_teste'
username = 'sa'
password = 's@s@'
conn_str = f'DRIVER={{SQL Server}};SERVER={server};DATABASE={database};UID={username};PWD={password}'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastro', methods=['POST'])
def cadastrar():
    # Obter os dados do formulário HTML
    nome = request.form['nome']
    email = request.form['email']
    senha = request.form['senha']

    try:
        # Estabelecer a conexão com o banco de dados
        conn = pyodbc.connect(conn_str)

        # Criar um cursor para executar consultas SQL
        cursor = conn.cursor()

        # Inserir os dados na tabela Usuarios
        cursor.execute("INSERT INTO Usuarios (Nome, Email, Senha) VALUES (?, ?, ?)", (nome, email, senha))
        conn.commit()

        # Fechar o cursor e a conexão
        cursor.close()
        conn.close()

        # Redirecionar para a página inicial com uma mensagem de sucesso
        return render_template('index.html', sucesso=True)

    except pyodbc.Error as e:
        # Se houver um erro, renderizar a página inicial com uma mensagem de erro
        return render_template('index.html', erro=f"Erro ao cadastrar usuário: {e}")

if __name__ == '__main__':
    app.run(debug=True)
