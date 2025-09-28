import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Fade,
  Alert,
  alpha,
  styled
} from '@mui/material';
import { SendRounded } from '@mui/icons-material';
import api from '../axios';
import React from 'react';

interface Props {
  onResult: (result: any) => void;
  onLoading: (loading: boolean) => void;
}

// Componentes estilizados
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: 24,
  background: theme.palette.background.paper,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  fontFamily: 'Poppins, sans-serif',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0,0,0,0.15)',
  },
}));

const OrangeButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
  color: '#fff',
  borderRadius: 13,
  padding: '14px 28px',
  fontWeight: 600,
  fontSize: '17px',
  textTransform: 'none',
  fontFamily: 'Poppins, sans-serif',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
  '&:hover': {
    background: 'linear-gradient(135deg, #E55A2B 0%, #CC4A23 100%)',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
  },
  '&:disabled': {
    background: alpha('#FF6B35', 0.6),
    transform: 'none',
    boxShadow: 'none',
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 16,
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.3s ease',
    '&:hover': {
      '& fieldset': {
        borderColor: alpha('#FF6B35', 0.4),
      },
    },
    '&.Mui-focused': {
      '& fieldset': {
        borderColor: '#FF6B35',
        borderWidth: 2,
      },
    },
    '& fieldset': {
      borderColor: alpha('#FF6B35', 0.2),
      borderWidth: 1,
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Poppins, sans-serif',
    color: alpha('#000', 0.6),
  },
}));

const ProcessEmailText = ({ onResult, onLoading }: Props) => {
  const [emailText, setEmailText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!emailText.trim()) {
      setError('Por favor, digite o texto do email');
      return;
    }

    onLoading(true);

    try {
      const formData = new FormData();
      formData.append('email_text', emailText);

      const response = await api.post('/email/process-text', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onResult(response.data);
      setEmailText(''); // Limpa o campo após sucesso
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao processar email';
      setError(errorMessage);
      onResult({
        status: 'error',
        error: errorMessage,
      });
    } finally {
      onLoading(false);
    }
  };

  const handleClear = () => {
    setEmailText('');
    setError('');
  };

  return (
    <Fade in timeout={800}>
      <StyledPaper elevation={0}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
            textAlign: 'center',
            fontFamily: 'Poppins, sans-serif',
            background: 'linear-gradient(135deg, #FF6B35 0%, #E55A2B 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Processar Texto do Email
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 4,
            fontFamily: 'Poppins, sans-serif',
            opacity: 0.8,
          }}
        >
        </Typography>

        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 2,
                fontFamily: 'Poppins, sans-serif',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              📝 Texto do Email
            </Typography>
            
            <StyledTextField
              value={emailText}
              onChange={(e) => {
                setEmailText(e.target.value);
                setError('');
              }}
              multiline
              rows={8}
              fullWidth
              placeholder="Cole o conteúdo do email aqui para análise..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '16px',
                  lineHeight: 1.6,
                },
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: emailText.length > 0 ? 'text.secondary' : 'transparent',
                  fontFamily: 'Poppins, sans-serif',
                  transition: 'color 0.3s ease',
                }}
              >
                {emailText.length} caracteres
              </Typography>
              
              {emailText.length > 0 && (
                <Button
                  onClick={handleClear}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    '&:hover': {
                      color: '#FF6B35',
                      backgroundColor: alpha('#FF6B35', 0.1),
                    },
                  }}
                >
                  Limpar texto
                </Button>
              )}
            </Box>
          </Box>

          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  fontFamily: 'Poppins, sans-serif',
                  '& .MuiAlert-message': {
                    fontFamily: 'Poppins, sans-serif',
                  }
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Fade>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <OrangeButton
              type="submit"
              fullWidth
              startIcon={<SendRounded />}
              disabled={!emailText.trim()}
              size="large"
            >
              Processar Email
            </OrangeButton>
          </Box>
        </form>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: alpha('#FF6B35', 0.03),
            borderRadius: 3,
            border: `1px solid ${alpha('#FF6B35', 0.1)}`,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontFamily: 'Poppins, sans-serif',
              display: 'block',
              textAlign: 'center',
              lineHeight: 1.5,
            }}
          >
            💡 Dica: Cole o conteúdo completo do email incluindo assunto e corpo para melhor análise
          </Typography>
        </Box>
      </StyledPaper>
    </Fade>
  );
};

export default ProcessEmailText;