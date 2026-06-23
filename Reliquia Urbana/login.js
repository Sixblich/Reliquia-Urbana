<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Iniciar Sesión</title>

    <link rel="stylesheet" href="style.css">

</head>

<body>

    <div class="container">

        <form class="form" id="loginForm">

            <h1>Iniciar Sesión</h1>

            <div class="input-group">

                <label>Correo electrónico</label>

                <input
                    type="email"
                    id="correo"
                    placeholder="Ingrese su correo"
                >

            </div>

            <div class="input-group">

                <label>Contraseña</label>

                <input
                    type="password"
                    id="password"
                    placeholder="Ingrese su contraseña"
                >

            </div>

            <button type="submit">
                Ingresar
            </button>

            <p id="mensaje"></p>

        </form>

    </div>

    <script type="module" src="login.js"></script>

</body>

</html>