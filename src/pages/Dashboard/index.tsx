import React, { useState, useEffect } from 'react';
import moment from 'moment';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get<{
        transactions: Transaction[];
        balance: Balance;
      }>('/transactions');

      const { transactions: trans, balance: bal } = response.data;

      setTransactions(trans);
      setBalance(bal);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />

      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              {`R$ ${formatValue(parseInt(balance.income, 10))}`}
            </h1>
          </Card>

          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              {`R$ ${formatValue(parseInt(balance.outcome, 10))}`}
            </h1>
          </Card>

          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              {`R$ ${formatValue(parseInt(balance.total, 10))}`}
            </h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((trans) => (
                <tr key={trans.id}>
                  <td className="title">{trans.title}</td>

                  <td className={trans.type}>
                    {trans.type === 'outcome' && '- '}
                    {`${formatValue(trans.value)}`}
                  </td>

                  <td>{trans?.category?.title || ''}</td>

                  <td>{moment(trans.created_at).format('DD/MM/YYYY')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
