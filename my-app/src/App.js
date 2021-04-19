import { useEffect, useState } from 'react';
import './App.css';
import instance from './axios-request';
import { get, set, remove } from 'js-cookie';
import ReactTable from 'react-table-v6'
import 'react-table-v6/react-table.css'

function App() {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [formTranfer, setFormTranfer] = useState({
    recipientAccount: '',
    amount: 0
  });
  const [transactions, setTransactions] = useState()
  const userCookie = get('USER_TOKEN');
  const getAllTransaction = async () => {
    const transaction = await instance.get(`/transations`);
    setTransactions(transaction.data.data);
  };
  const createTransaction = async (data) => {
    return instance.post(`/transations/send-money`, data);
  };
  const login = (data) => {
    return instance.post(`/user/login`, data);
  };
  useEffect(() => {
    getAllTransaction();
  }, [])

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  }

  const handleChangeTranfer = (event) => {
    setFormTranfer({ ...formTranfer, [event.target.name]: event.target.value });
  }
  const handleSubmitTranfer = async () => {
    try {
      await createTransaction(formTranfer);
      getAllTransaction();
    } catch (error) {
      alert(error)
    }
  }

  const handleSubmit = async () => {
    try {
      const { data } = await login(user);
      set('USER_TOKEN', data.data.token)
      window.location.reload()
    } catch (error) {
      alert(error)
    }
  }

  const columns = [{
    Header: 'Sender Account',
    accessor: 'senderAccount'
  }, {
    Header: 'Recipient Account',
    accessor: 'recipientAccount',
  }, {
    Header: 'Amount',
    accessor: 'amount',
  }, {
    Header: 'Date',
    accessor: 'date',
  }];

  const logout = () => {
    remove('USER_TOKEN');
    window.location.reload()
  }

  return (
    <div className="App">
      <header>
        {
          !userCookie && (
            <fieldset>
              <legend>Login:</legend>
              <label>
                email:
                <input name="email" type="text" value={user.email} onChange={handleChange} />
              </label>
              <br />
              <label>
                password:
                <input name="password" type="password" value={user.password} onChange={handleChange} />
              </label>
              <br />
              <button onClick={handleSubmit}>Login</button>
            </fieldset>
          )
        }
        {
          userCookie && (
            <>
              <button onClick={logout} >Logout</button>
              <fieldset>
                <legend>Tranfer Money:</legend>
                <label>
                  Recipient:
                <input name="recipientAccount" type="text" value={formTranfer.recipientAccount} onChange={handleChangeTranfer} />
                </label>
                <br />
                <label>
                  amount:
                <input name="amount" type="number" value={formTranfer.amount} onChange={handleChangeTranfer} />
                </label>
                <br />
                <button onClick={handleSubmitTranfer}>Submit</button>
              </fieldset>
              <div>
                <ReactTable
                  data={transactions}
                  columns={columns}
                />
              </div>

            </>

          )
        }
      </header>
    </div>
  );
}

export default App;
