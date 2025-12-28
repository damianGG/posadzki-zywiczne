// Social Media Environment Configuration
// Centralized access to all social media-related environment variables

export interface SocialMediaConfig {
  // OpenAI for content generation
  openai: {
    apiKey: string;
  };
  
  // Google Business Profile
  googleBusiness: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    enabled: boolean;
  };
  
  // Facebook & Instagram
  facebook: {
    appId: string;
    appSecret: string;
    redirectUri: string;
    enabled: boolean;
  };
  
  instagram: {
    accessToken?: string;
    enabled: boolean;
  };
  
  // TikTok
  tiktok: {
    clientKey: string;
    clientSecret: string;
    redirectUri: string;
    enabled: boolean;
  };
  
  // Pinterest
  pinterest: {
    appId: string;
    appSecret: string;
    redirectUri: string;
    enabled: boolean;
  };
  
  // LinkedIn
  linkedin: {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    enabled: boolean;
  };
  
  // Cron
  cron: {
    secret: string;
  };
  
  // Supabase
  supabase: {
    url: string;
    serviceRoleKey: string;
  };
  
  // Cloudinary
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

/**
 * Get social media configuration from environment variables
 * Throws error if required variables are missing
 */
export function getSocialMediaConfig(): SocialMediaConfig {
  // Helper to get env var or throw error
  const getEnvVar = (key: string, required: boolean = true): string => {
    const value = process.env[key];
    if (required && !value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value || '';
  };
  
  // Helper to check if platform is enabled
  const isEnabled = (key: string, defaultValue: boolean = true): boolean => {
    const value = process.env[key];
    if (!value) return defaultValue;
    return value.toLowerCase() === 'true';
  };
  
  return {
    openai: {
      apiKey: getEnvVar('OPENAI_API_KEY'),
    },
    
    googleBusiness: {
      clientId: getEnvVar('GOOGLE_BUSINESS_CLIENT_ID', false),
      clientSecret: getEnvVar('GOOGLE_BUSINESS_CLIENT_SECRET', false),
      redirectUri: getEnvVar('GOOGLE_BUSINESS_REDIRECT_URI', false),
      enabled: isEnabled('ENABLE_GOOGLE_BUSINESS'),
    },
    
    facebook: {
      appId: getEnvVar('FACEBOOK_APP_ID', false),
      appSecret: getEnvVar('FACEBOOK_APP_SECRET', false),
      redirectUri: getEnvVar('FACEBOOK_REDIRECT_URI', false),
      enabled: isEnabled('ENABLE_FACEBOOK'),
    },
    
    instagram: {
      accessToken: getEnvVar('INSTAGRAM_ACCESS_TOKEN', false),
      enabled: isEnabled('ENABLE_INSTAGRAM'),
    },
    
    tiktok: {
      clientKey: getEnvVar('TIKTOK_CLIENT_KEY', false),
      clientSecret: getEnvVar('TIKTOK_CLIENT_SECRET', false),
      redirectUri: getEnvVar('TIKTOK_REDIRECT_URI', false),
      enabled: isEnabled('ENABLE_TIKTOK', false),
    },
    
    pinterest: {
      appId: getEnvVar('PINTEREST_APP_ID', false),
      appSecret: getEnvVar('PINTEREST_APP_SECRET', false),
      redirectUri: getEnvVar('PINTEREST_REDIRECT_URI', false),
      enabled: isEnabled('ENABLE_PINTEREST', false),
    },
    
    linkedin: {
      clientId: getEnvVar('LINKEDIN_CLIENT_ID', false),
      clientSecret: getEnvVar('LINKEDIN_CLIENT_SECRET', false),
      redirectUri: getEnvVar('LINKEDIN_REDIRECT_URI', false),
      enabled: isEnabled('ENABLE_LINKEDIN', false),
    },
    
    cron: {
      secret: getEnvVar('CRON_SECRET', false),
    },
    
    supabase: {
      url: getEnvVar('SUPABASE_URL'),
      serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    },
    
    cloudinary: {
      cloudName: getEnvVar('CLOUDINARY_CLOUD_NAME'),
      apiKey: getEnvVar('CLOUDINARY_API_KEY'),
      apiSecret: getEnvVar('CLOUDINARY_API_SECRET'),
    },
  };
}

/**
 * Get list of enabled platforms
 */
export function getEnabledPlatforms(): string[] {
  const config = getSocialMediaConfig();
  const platforms: string[] = [];
  
  if (config.googleBusiness.enabled && config.googleBusiness.clientId) {
    platforms.push('google_business');
  }
  if (config.instagram.enabled && config.instagram.accessToken) {
    platforms.push('instagram');
  }
  if (config.facebook.enabled && config.facebook.appId) {
    platforms.push('facebook');
  }
  if (config.tiktok.enabled && config.tiktok.clientKey) {
    platforms.push('tiktok');
  }
  if (config.pinterest.enabled && config.pinterest.appId) {
    platforms.push('pinterest');
  }
  if (config.linkedin.enabled && config.linkedin.clientId) {
    platforms.push('linkedin');
  }
  
  return platforms;
}

/**
 * Check if a specific platform is enabled and configured
 */
export function isPlatformEnabled(platform: string): boolean {
  return getEnabledPlatforms().includes(platform);
}

/**
 * Validate that minimum required configuration is present
 * Throws error with helpful message if configuration is invalid
 */
export function validateSocialMediaConfig(): void {
  try {
    const config = getSocialMediaConfig();
    
    // Check OpenAI (required for content generation)
    if (!config.openai.apiKey) {
      throw new Error('OpenAI API key is required for AI content generation');
    }
    
    // Check Supabase (required for data storage)
    if (!config.supabase.url || !config.supabase.serviceRoleKey) {
      throw new Error('Supabase configuration is required');
    }
    
    // Check Cloudinary (required for image management)
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey) {
      throw new Error('Cloudinary configuration is required');
    }
    
    // Warn if no platforms are enabled
    const enabledPlatforms = getEnabledPlatforms();
    if (enabledPlatforms.length === 0) {
      console.warn('Warning: No social media platforms are enabled or configured');
    } else {
      console.log(`✓ Social media platforms enabled: ${enabledPlatforms.join(', ')}`);
    }
    
  } catch (error) {
    console.error('Social media configuration validation failed:', error);
    throw error;
  }
}
