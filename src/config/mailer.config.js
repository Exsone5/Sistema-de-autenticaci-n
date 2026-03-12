import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Envía un email de recuperación de contraseña
 * @param {string} to - Email del destinatario
 * @param {string} resetUrl - URL con el token de recuperación
 */
export const sendPasswordResetEmail = async (to, resetUrl) => {
    const mailOptions = {
        from: `"CoderShop" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Recuperación de contraseña - CoderShop',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Recuperación de Contraseña</h2>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta.</p>
                <p>Hacé click en el botón de abajo para crear una nueva contraseña. 
                   El enlace expirará en <strong>1 hora</strong>.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Restablecer Contraseña
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    Si no solicitaste este cambio, podés ignorar este email. 
                    Tu contraseña seguirá siendo la misma.
                </p>
                <p style="color: #999; font-size: 12px;">
                    Este enlace expirará en 1 hora por razones de seguridad.
                </p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Envía un email de confirmación de compra con el ticket
 * @param {string} to - Email del comprador
 * @param {object} ticket - Datos del ticket generado
 */
export const sendPurchaseConfirmationEmail = async (to, ticket) => {
    const mailOptions = {
        from: `"CoderShop" <${process.env.EMAIL_USER}>`,
        to,
        subject: `Confirmación de compra - Ticket #${ticket.code}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">¡Gracias por tu compra!</h2>
                <p>Tu pedido fue procesado exitosamente.</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Detalles del Ticket</h3>
                    <p><strong>Código:</strong> ${ticket.code}</p>
                    <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString('es-AR')}</p>
                    <p><strong>Total:</strong> $${ticket.amount.toFixed(2)}</p>
                </div>
                <p>Recibirás más información sobre el envío próximamente.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};
