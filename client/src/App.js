import './App.css';
import { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';

function App() {
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [date, setDate] = useState('');
  const [url, setUrl] = useState('');
  const [token, setToken] = useState(null);
  const [preflight, setPreflight] = useState(true);
  const [loading, setLoading] = useState(false);
  const [presentation, setPresentation] = useState(null);
  
  useEffect(() => {
    if (!token) {
      fetch('/authorize')
        .then(res => {
          return res.json();
        })
        .then(response => {
          if (typeof response === 'string') {
            window.location.assign(response);
          }
          if (typeof response === 'object') {
            setToken(response)
          }
        })
        .catch(error => console.log(error));
    }
  }, [token]);

  const handleClick = e => {
    e.preventDefault();
    const slideData = {
      title: title,
      name: name,
      jobTitle: jobTitle,
      company: company,
      date: date,
      url: url,
      token: token
    }

    if (title === '') {
      window.alert('Please enter a title for the slide.');
    }
    else if (name === '') {
      window.alert('Please enter the presenter\'s name.');
    }
    else if (jobTitle === '') {
      window.alert('Please enter the presenter\'s job title.');
    }
    else if (company === '') {
      window.alert('Please enter the client company.');
    }
    else if (!date) {
      window.alert('Please enter a date.');
    }
    else if (url === '') {
      window.alert('Please enter a company URL.');
    }
    else {
      setLoading(true);

      fetch('/create-slide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(slideData)
        })
        .then(response => {
          return response.json();
        })
        .then(id => {
          setPresentation(id);
          setLoading(false);
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <div className='App'>
      <div className='container'>
        <h1>Title Slide Generator</h1>
        <form onSubmit={e => handleClick(e)}>
          <div className='input-row'>
            <div className='user-input'>
              <label for='slide-title'>Slide Title: </label>
              <input 
                type='text'
                name='slide-title'
                id='slide-title'
                onChange={e => setTitle(e.target.value)}
                value={title}
              />
            </div>
            <div className='user-input'>
              <label for='name'>Presenter Name: </label>
              <input 
                type='text'
                name='name'
                id='name'
                onChange={e => setName(e.target.value)}
                value={name}
              />
            </div>
          </div>
          <div className='input-row'>
            <div className='user-input'>
                <label for='job-title'>Presenter Job Title: </label>
                <input 
                  type='text'
                  name='job-title'
                  id='job-title'
                  onChange={e => setJobTitle(e.target.value)}
                  value={jobTitle}
                />
              </div>
            <div className='user-input'>
              <label for='company'>Company (Client): </label>
              <input 
                type='text'
                name='company'
                id='company'
                onChange={e => setCompany(e.target.value)}
                value={company}
              />
            </div>
          </div>
          <div className='input-row'>
              <div className='user-input'>
              <label for='date'>Presentation Date: </label>
              <input 
                type='date'
                name='date'
                id='date'
                onChange={e => setDate(e.target.value)}
                value={date}
              />
            </div>
            <div className='user-input'>
              <label for='url'>Company URL: </label>
              <input 
                type='text'
                name='url'
                id='url'
                onChange={e => setUrl(e.target.value)}
                value={url}
              />
            </div>
          </div>
          <Button className='submit-button' type='submit'>Submit</Button>
          {loading &&
            <div className='loading'>Loading...</div>
          }
          {presentation &&
            <a 
              href={`https://docs.google.com/presentation/d/${presentation}/preview#slide=id.p`} 
              target='_blank'
              className='presentation-button'
            >View Presentation</a>
          }
        </form>
      </div>
    </div>
  );
}

export default App;
