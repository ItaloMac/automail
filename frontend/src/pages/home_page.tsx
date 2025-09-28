import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Select, 
  MenuItem, 
  Button, 
  Card, 
  CardContent, 
  CircularProgress, 
  Alert,
  Fade,
  Slide,
  Container,
  Paper,
  Chip,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ProcessEmailText from '../components/process_email_text';
import ProcessEmailPdf from '../components/process_email_pdf';
import ProcessEmailTxt from '../components/process_email_txt';
import EmailHistory from '../components/email_history'; // Importar o novo componente
import React from 'react';


interface EmailResult {
  status: string;
  category: string;
  confidence: number;
  email_type: string;
  suggested_response: string;
  error?: string;
}

// Componentes estilizados
const GradientBox = styled(Box)(({ theme }) => ({
  minHeight: '90vh', // Reduzido de 100vh para 90vh
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Poppins, sans-serif',
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: 12, 
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)', // Reduzido o tamanho da sombra
  backdropFilter: 'blur(8px)', // Reduzido de 10px para 8px
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'all 0.3s ease-in-out',
  maxWidth: '700px', // Adicionado limite de largura
  margin: '0 auto', // Centralizar horizontalmente
  '&:hover': {
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)', // Reduzido o tamanho da sombra
    transform: 'translateY(-1px)', // Reduzido de -2px para -1px
  },
}));

const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FF6B35',
  color: '#fff',
  borderRadius: 13,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: 'Poppins, sans-serif',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#E55A2B',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.3)',
  },
  '&:disabled': {
    backgroundColor: alpha('#FF6B35', 0.6),
  },
}));

const CategoryChip = styled(Chip)(({ theme, category }: { theme?: any; category: string }) => ({
  backgroundColor: category === 'Produtivo' 
    ? alpha(theme.palette.success.main, 0.1) 
    : alpha(theme.palette.warning.main, 0.1),
  color: category === 'Produtivo' 
    ? theme.palette.success.dark 
    : theme.palette.warning.dark,
  fontWeight: 'bold',
  borderRadius: 8,
  border: `1px solid ${category === 'Produtivo' 
    ? alpha(theme.palette.success.main, 0.3) 
    : alpha(theme.palette.warning.main, 0.3)}`,
}));

const ConfidenceBar = styled(Box)(({ confidence }: { confidence: number }) => ({
  width: '100%',
  height: 8,
  backgroundColor: alpha('#FF6B35', 0.2),
  borderRadius: 4,
  overflow: 'hidden',
  '&::after': {
    content: '""',
    display: 'block',
    height: '100%',
    width: `${confidence * 100}%`,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
    transition: 'width 0.5s ease-in-out',
  },
}));

const HomePage = () => {
  const [selectedType, setSelectedType] = useState<string>('');
  const [result, setResult] = useState<EmailResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false); // Estado para exibir o histórico

  const handleResult = (data: EmailResult) => {
    setResult(data);
    setLoading(false);
  };

  const handleLoading = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const handleNewProcessing = () => {
    setSelectedType('');
    setResult(null);
    setShowHistory(false); // Voltar para a tela inicial
  };

  const renderComponent = () => {
    switch (selectedType) {
      case 'text':
        return <ProcessEmailText onResult={handleResult} onLoading={handleLoading} />;
      case 'pdf':
        return <ProcessEmailPdf onResult={handleResult} onLoading={handleLoading} />;
      case 'txt':
        return <ProcessEmailTxt onResult={handleResult} onLoading={handleLoading} />;
      default:
        return null;
    }
  };

  return (
    <GradientBox>
      <Container maxWidth="lg" sx={{ maxWidth: '1024px' }}>
        {loading ? (
          <StyledCard sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress 
              size={48} 
              sx={{ color: '#FF6B35', mb: 3 }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500, 
                color: 'text.primary',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Processando email, aguarde...
            </Typography>
          </StyledCard>
        ) : result ? (
          <StyledCard sx={{ p: 4, textAlign: 'center' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mb: 4, 
                color: 'text.primary',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Resultado do Processamento
            </Typography>

            {result.status === 'error' ? (
              <Alert 
                severity="error" 
                sx={{ 
                  borderRadius: 3,
                  fontFamily: 'Poppins, sans-serif',
                }}
              >
                {result.error}
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: 'text.primary',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    Categoria:
                  </Typography>
                  <CategoryChip 
                    label={result.category} 
                    category={result.category}
                  />
                </Box>

                <Box sx={{ textAlign: 'left' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 1,
                      color: 'text.primary',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    Nível de Confiança:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ConfidenceBar confidence={result.confidence} />
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: '#FF6B35',
                        fontFamily: 'Poppins, sans-serif',
                        minWidth: 60,
                      }}
                    >
                      {(result.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'left' }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600, 
                      mb: 2,
                      color: 'text.primary',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >
                    💡 Resposta Sugerida:
                  </Typography>
                  <CardContent
                    sx={{
                      backgroundColor: alpha('#FF6B35', 0.03),
                      borderRadius: 3,
                      p: 3,
                      border: `1px solid ${alpha('#FF6B35', 0.1)}`,
                      fontSize: '1rem',
                      color: 'text.primary',
                      fontFamily: 'Poppins, sans-serif',
                      lineHeight: 1.6,
                    }}
                  >
                    {result.suggested_response}
                  </CardContent>
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              sx={{
                mt: 4,
                backgroundColor: '#FF6B35',
                color: '#fff',
                fontFamily: 'Poppins, sans-serif',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#E55A2B',
                },
              }}
              onClick={handleNewProcessing}
            >
              Novo Processamento
            </Button>
          </StyledCard>
        ) : showHistory ? (
          <EmailHistory onBack={() => setShowHistory(false)} /> // Exibir o componente de histórico
        ) : (
          <>
            <Slide in direction="down" timeout={500}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <img src="/LOGOTIPO.png" alt="Logo" style={{ width: 350, marginBottom: 16 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'text.secondary',
                    mb: 1,
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 300,
                  }}
                >
                  Sistema de Processamento Automático de Emails com IA
                </Typography>
              </Box>
            </Slide>

            <Slide in direction="up" timeout={700}>
              <StyledCard sx={{ p: 4, mb: 4 }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600, 
                    mb: 3,
                    color: 'text.primary',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Selecione o tipo de email
                </Typography>
                
                <Select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  fullWidth
                  displayEmpty
                  sx={{ 
                    mb: 3,
                    borderRadius: 3,
                    fontFamily: 'Poppins, sans-serif',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: alpha('#FF6B35', 0.3),
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#FF6B35',
                    },
                  }}
                >
                  <MenuItem value="" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    Escolha uma opção...
                  </MenuItem>
                  <MenuItem value="text" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    📝 Texto (Digite diretamente)
                  </MenuItem>
                  <MenuItem value="pdf" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    📄 Upload de PDF
                  </MenuItem>
                  <MenuItem value="txt" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                    📁 Upload de TXT
                  </MenuItem>
                </Select>

                <Fade in={selectedType !== ''} timeout={500}>
                  <Box sx={{ mt: 3 }}>
                    {renderComponent()}
                  </Box>
                </Fade>

                <Button
                  variant="outlined"
                  sx={{
                    mt: 3,
                    borderColor: '#FF6B35',
                    color: '#FF6B35',
                    fontFamily: 'Poppins, sans-serif',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#E55A2B',
                      color: '#E55A2B',
                    },
                  }}
                  onClick={() => setShowHistory(true)} // Exibir o histórico
                >
                  Emails Processados
                </Button>
              </StyledCard>
            </Slide>
          </>
        )}
         <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            © Desenvolvido por{" "}
            <a 
              href="https://wa.me/5571999341709?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20o%20or%C3%A7amento%20de%20um%20site%2Fsistema."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#FF6B35',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#E55A2B'}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#FF6B35')}
            >
              Ítalo Macedo
            </a>
          </Typography>
        </Box>
      </Container>
    </GradientBox>
    
  );
};

export default HomePage;