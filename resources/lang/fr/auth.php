<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pages d'authentification (FR)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // CONNEXION
    // ──────────────────────────────────────────────────────────────────────
    'login' => [
        'title' => 'Prêt à faire passer ta carrière de parkour au niveau supérieur ?',
        'subtitle_part_1' => 'Prêt à faire passer ta',
        'subtitle_part_2' => 'carrière de parkour au niveau supérieur ?',
        'description' => 'Connecte-toi pour synchroniser ton profil, accéder à tes records personnels, gagner des récompenses et débloquer des fonctionnalités communautaires — en un seul clic.',
        'fast' => 'Rapide',
        'fast_desc' => 'Connexion OAuth en un clic.',
        'secure' => 'Sécurisé',
        'secure_desc' => 'Aucun mot de passe stocké.',
        'sign_in' => 'Se connecter',
        'discord_login' => 'Continuer avec Discord',
        'email_login' => "Se connecter avec l'email",
        'email_tab' => 'Email',
        'discord_tab' => 'Discord',
        'email_label' => 'Email',
        'password_label' => 'Mot de passe',
        'forgot_password' => 'Mot de passe oublié ?',
        'create_account' => 'Créer un compte',
        'no_account' => "Tu n'as pas de compte ?",
        'no_account_action' => "S'inscrire",
        'submit_button' => 'Se connecter',
        'please_fix' => 'Veuillez corriger :',
        'providers_description' => 'Continue avec le fournisseur de ton choix.',
        'agreement' => 'En continuant, tu acceptes les règles de la communauté.',
        'recommended' => 'Recommandé',
        'password_badge' => 'Mot de passe',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // INSCRIPTION
    // ──────────────────────────────────────────────────────────────────────
    'register' => [
        'title' => 'Créer ton compte',
        'description' => "Inscris-toi avec ton email pour débloquer tes records personnels, des récompenses et des fonctionnalités communautaires.",
        'private' => 'Privé',
        'private_desc' => "Nous n'affichons pas ton email publiquement.",
        'verified' => 'Vérifié',
        'verified_desc' => "Nous t'enverrons un email de vérification.",
        'sign_up' => "S'inscrire",
        'sign_up_title' => "S'inscrire",
        'sign_up_desc' => 'Crée ton compte email en quelques secondes.',
        'please_fix' => 'Veuillez corriger :',
        'username_label' => "Nom d'utilisateur (optionnel)",
        'email_label' => 'Email',
        'password_label' => 'Mot de passe',
        'password_confirm_label' => 'Confirmer le mot de passe',
        'username_placeholder' => 'GenjiMain',
        'email_placeholder' => 'toi@exemple.com',
        'password_placeholder' => '••••••••',
        'submit_button' => 'Créer un compte',
        'recommended' => 'Recommandé',
        'password_badge' => 'Mot de passe',
        'already_have_account' => 'Tu as déjà un compte ?',
        'sign_in' => 'Se connecter',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MOT DE PASSE OUBLIÉ
    // ──────────────────────────────────────────────────────────────────────
    'forgot_password' => [
        'badge' => 'Réinitialisation du mot de passe',
        'title' => 'Mot de passe oublié ?',
        'description' => "Entre ton email et nous t'enverrons un lien de réinitialisation.",
        'email_label' => 'Email',
        'email_placeholder' => 'toi@exemple.com',
        'submit_button' => 'Envoyer le lien de réinitialisation',
        'back_to_login' => 'Retour à la connexion',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RÉINITIALISER LE MOT DE PASSE
    // ──────────────────────────────────────────────────────────────────────
    'reset_password' => [
        'badge' => 'Réinitialisation du mot de passe',
        'title' => 'Réinitialiser le mot de passe',
        'password_label' => 'Nouveau mot de passe',
        'password_confirm_label' => 'Confirmer le mot de passe',
        'submit_button' => 'Réinitialiser le mot de passe',
        'back_to_login' => 'Retour à la connexion',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // VÉRIFICATION EMAIL
    // ──────────────────────────────────────────────────────────────────────
    'verify_email' => [
        'title' => 'Vérifie ton email',
        'description' => "Nous t'avons envoyé un lien de vérification. Clique dessus pour activer ton compte.",
        'email_label' => 'Email',
        'email_placeholder' => 'toi@exemple.com',
        'resend_button' => "Renvoyer l'email de vérification",
        'back_to_login' => 'Retour à la connexion',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'register_success' => "Inscription réussie ! Vérifie ta boîte mail pour valider ton compte.",
        'login_success' => 'Connexion réussie !',
        'verify_success' => "Email vérifié avec succès ! Tu peux maintenant accéder à toutes les fonctionnalités.",
        'reset_sent' => "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        'reset_success' => "Mot de passe réinitialisé avec succès ! Tu peux maintenant te connecter.",
        'invalid_credentials' => 'Email ou mot de passe incorrect.',
        'email_not_verified' => "Veuillez vérifier votre email pour accéder à toutes les fonctionnalités.",
        'invalid_reset_link' => 'Lien de réinitialisation invalide.',
        'registration_failed' => "Échec de l'inscription.",
        'login_failed' => "Échec de la connexion (réponse API invalide).",
        'reset_failed' => 'Échec de la réinitialisation du mot de passe.',
        'verification_resent' => "L'email de vérification a été renvoyé.",
        'resend_verification_failed' => "Impossible de renvoyer l'email de vérification.",
    ],
];
