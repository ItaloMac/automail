import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Fade,
  Alert,
  alpha,
  styled,
  Chip
} from '@mui/material';
import { CloudUpload, Description, CheckCircle, TextFields } from '@mui/icons-material';
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
  backgroundColor: '#ffffff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: `1px solid ${alpha('#FF6B35', 0.1)}`,
  fontFamily: 'Poppins, sans-serif',
}));

const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6B35',
  color: '#fff',
  borderRadius: 13,
  padding: '14px 28px',
  fontWeight: 600,
  fontSize: '17px',
  textTransform: 'none',
  fontFamily: 'Poppins, sans-serif',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E55A2B',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
  },
  '&:disabled': {
    backgroundColor: alpha('#FF6B35', 0.4),
    color: alpha('#fff', 0.7),
  },
}));

const UploadArea = styled(Box)(({ theme, hasFile }: { theme?: any; hasFile: boolean }) => ({
  border: `2px dashed ${hasFile ? '#4CAF50' : alpha('#FF6B35', 0.3)}`,
  borderRadius: 16,
  padding: theme.spacing(4),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: hasFile ? alpha('#4CAF50', 0.05) : alpha('#FF6B35', 0.02),
  '&:hover': {
    borderColor: hasFile ? '#4CAF50' : '#FF6B35',
    backgroundColor: hasFile ? alpha('#4CAF50', 0.08) : alpha('#FF6B35', 0.05),
  },
}));

const HiddenInput = styled('input')({
  display: 'none',
});

const FileInfoCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: alpha('#4CAF50', 0.08),
  borderRadius: 12,
  border: `1px solid ${alpha('#4CAF50', 0.2)}`,
  marginTop: theme.spacing(2),
}));

const ProcessEmailTxt = ({ onResult, onLoading }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError('');
    
    if (file) {
      // Verifica tanto por type quanto por extensão .txt
      if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
        setSelectedFile(file);
      } else {
        setError('Por favor, selecione apenas arquivos TXT');
        e.target.value = '';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Por favor, selecione um arquivo TXT');
      return;
    }

    onLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await api.post('/email/process-txt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onResult(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Erro ao processar arquivo TXT';
      setError(errorMessage);
      onResult({
        status: 'error',
        error: errorMessage
      });
    } finally {
      onLoading(false);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
          }}
        >
          Processar Arquivo TXT
        </Typography>
        
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            mb: 4,
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Faça upload de um arquivo de texto para análise e classificação automática
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
              📝 Selecione o Arquivo TXT
            </Typography>

            <HiddenInput
              accept=".txt"
              id="txt-upload"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="txt-upload">
              <UploadArea hasFile={!!selectedFile}>
                {selectedFile ? (
                  <Box>
                    <CheckCircle 
                      sx={{ 
                        fontSize: 48, 
                        color: '#4CAF50',
                        mb: 2 
                      }} 
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#4CAF50',
                        fontWeight: 600,
                        mb: 1,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Arquivo Selecionado!
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Clique para selecionar outro arquivo
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUpload 
                      sx={{ 
                        fontSize: 48, 
                        color: '#FF6B35',
                        mb: 2 
                      }} 
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        mb: 1,
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      Clique para fazer upload
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        fontFamily: 'Poppins, sans-serif',
                        mb: 1,
                      }}
                    >
                      Arraste ou selecione um arquivo de texto
                    </Typography>
                    <Chip
                      label="TXT apenas"
                      size="small"
                      sx={{
                        backgroundColor: alpha('#FF6B35', 0.1),
                        color: '#FF6B35',
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                )}
              </UploadArea>
            </label>

            {selectedFile && (
              <FileInfoCard>
                <TextFields sx={{ color: '#4CAF50' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {selectedFile.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    {formatFileSize(selectedFile.size)} • Arquivo de texto
                  </Typography>
                </Box>
                <Button
                  onClick={handleClearFile}
                  size="small"
                  sx={{
                    color: 'text.secondary',
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    '&:hover': {
                      color: '#FF6B35',
                      backgroundColor: alpha('#FF6B35', 0.1),
                    },
                  }}
                >
                  Remover
                </Button>
              </FileInfoCard>
            )}
          </Box>

          {error && (
            <Fade in>
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  fontFamily: 'Poppins, sans-serif',
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            </Fade>
          )}

          <OrangeButton
            type="submit"
            fullWidth
            disabled={!selectedFile}
            size="large"
            startIcon={<TextFields />}
          >
            Processar TXT
          </OrangeButton>
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
            💡 Formatos suportados: TXT • Tamanho máximo: 10MB
          </Typography>
        </Box>
      </StyledPaper>
    </Fade>
  );
};

export default ProcessEmailTxt;