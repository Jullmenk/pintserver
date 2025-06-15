function notifyUserHTML(title, message, resumo) {
  const anoAtual = new Date().getFullYear();

  return `
    <!DOCTYPE html>
    <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirme o seu email</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
            Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          background-color: #ffffff;
          margin: 0 auto;
          color: #000;
        }
        .container {
          padding: 0 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        h1 {
          color: #1d1c1d;
          font-size: 18px;
          font-weight: 700;
          margin: 30px 0;
          line-height: 42px;
        }
        p {
          font-size: 14px;
          line-height: 24px;
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: black;
          color: white !important;
          padding: 10px 15px;
          font-size: 15px;
          text-decoration: none;
          font-weight: bold;
          margin-bottom: 20px;
          border-radius: 4px;
        }
        .footer {
          font-size: 12px;
          color: #b7b7b7;
          line-height: 15px;
          margin-top: 50px;
        }
        .logo {
          margin-top: 32px;
          margin-bottom: 30px;
        }
        .logo img {
          width: 152px;
          height: 45px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://res.cloudinary.com/dkvsuatxf/image/upload/v1747750371/ryhcggxgm3t1n5njhdcn.png" alt="Softinsa Logo" />
        </div>
        <h1>${title}</h1>
        <p>${message}</p>
        <p>${resumo}</p>
        <hr />
        <p><strong>SOFTINSA</strong></p>
        <p class="footer">©${anoAtual} Softinsa,<br/>Todos direitos reservados.</p>
      </div>
    </body>
    </html>
  `;
}

module.exports = { notifyUserHTML };
