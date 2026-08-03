// api/process-payment.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { amount, description } = req.body;

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ error: 'Monto inválido.' });
  }

  // Obtenemos las credenciales desde las variables de entorno
  const userName = process.env.UALA_USERNAME;
  const clientId = process.env.UALA_CLIENT_ID;
  const clientSecret = process.env.UALA_CLIENT_SECRET_ID;

  if (!userName || !clientId || !clientSecret) {
    return res.status(500).json({ error: 'Faltan configurar las variables de entorno de Ualá Bis.' });
  }

  try {
    // 1. Obtener Token de Acceso desde la API de Ualá Bis
    const authResponse = await fetch('https://auth.ualabis.com.ar/api/v2/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_name: userName,
        client_id: clientId,
        client_secret_id: clientSecret,
        grant_type: 'client_credentials'
      })
    });

    const authData = await authResponse.json();

    if (!authResponse.ok || !authData.access_token) {
      return res.status(401).json({ error: 'Error al autenticar con Ualá Bis', details: authData });
    }

    const accessToken = authData.access_token;

    // 2. Crear la orden de checkout/cobro con el Token obtenido
    const checkoutResponse = await fetch('https://checkout.ualabis.com.ar/api/v1/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        amount: Number(amount),
        description: description || 'Donación a Huellitas Rescatados',
        userName: userName,
        callback_fail: 'https://tu-pagina.com/donaciones?status=failed',
        callback_success: 'https://tu-pagina.com/donaciones?status=success'
      })
    });

    const checkoutData = await checkoutResponse.json();

    if (!checkoutResponse.ok) {
      return res.status(checkoutResponse.status).json({
        error: 'Error al generar la orden de pago',
        details: checkoutData
      });
    }

    // Retornamos el link de pago generado
    return res.status(200).json({
      success: true,
      checkoutUrl: checkoutData.links ? checkoutData.links.checkout : checkoutData.checkout_url
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error interno en el servidor',
      message: error.message
    });
  }
}