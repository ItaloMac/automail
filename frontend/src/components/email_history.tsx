import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button,
  CircularProgress, 
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../axios';
import React from 'react';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: 12,
  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.divider}`,
}));

interface EmailHistoryProps {
  onBack: () => void;
}

const EmailHistory = ({ onBack }: EmailHistoryProps) => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); // 'all', 'Produtivo', 'Improdutivo'
  
  const emailsPerPage = 3;

  useEffect(() => {
    const fetchEmails = async () => {
      setLoading(true);
      try {
        let response;
        if (filter === 'all') {
          response = await api.get('/history/');
        } else {
          response = await api.get(`/history/category/${filter}`);
        }
        setEmails(response.data);
        setCurrentPage(1); // Reset para primeira página ao mudar filtro
      } catch (err: any) {
        setError('Erro ao carregar o histórico de emails.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [filter]);

  // Calcular emails para a página atual
  const startIndex = (currentPage - 1) * emailsPerPage;
  const endIndex = startIndex + emailsPerPage;
  const currentEmails = emails.slice(startIndex, endIndex);
  const totalPages = Math.ceil(emails.length / emailsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const handleFilterChange = (event: any) => {
    setFilter(event.target.value);
  };

  return (
    <Box
    sx={{ 
        my: 10, // Margem vertical (superior e inferior)
        mx: 'auto', // Centraliza horizontalmente
      }}
    >
        
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
        Histórico de Emails Processados
      </Typography>

      {/* Filtro */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Categoria</InputLabel>
          <Select
            value={filter}
            label="Filtrar por Categoria"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">Todos os Emails</MenuItem>
            <MenuItem value="Produtivo">Produtivos</MenuItem>
            <MenuItem value="Improdutivo">Improdutivos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : emails.length === 0 ? (
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          Nenhum email processado encontrado no momento.
        </Typography>
      ) : (
        <>
          {/* Lista de emails da página atual */}
          {currentEmails.map((email: any) => (
            <StyledCard key={email.id}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Categoria: {email.category}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Confiança: {(email.ai_confidence * 100).toFixed(1)}%
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Corpo do email: {email.text_preview}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Resposta Sugerida: {email.response_preview}
                </Typography>
              </CardContent>
            </StyledCard>
          ))}

          {/* Paginação */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}

          {/* Info da paginação */}
          <Typography 
            variant="body2" 
            sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}
          >
            Mostrando {startIndex + 1}-{Math.min(endIndex, emails.length)} de {emails.length} emails
          </Typography>
        </>
      )}

      <Button
        variant="contained"
        sx={{
          mt: 4,
          backgroundColor: '#FF6B35',
          color: '#fff',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#E55A2B',
          },
        }}
        onClick={onBack}
      >
        Voltar
      </Button>
    </Box>
  );
};

export default EmailHistory;