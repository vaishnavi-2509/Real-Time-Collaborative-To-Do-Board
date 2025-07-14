import React, { useState } from 'react'
import Login from './Login'
import Register from './Register'

function Home() {
   const [isLogin, setIsLogin] = useState(true);
  return (
    <div className='auth-container'>
        <div className='auth-card'>
            <div className='auth-header'>
                <h1 className='auth-title'>To-DO Board</h1>
                <p className='auth-subtitle'>{isLogin? 'Welcome back!': "Create your account"}</p>
            </div>

            <div className='auth-tabs'>
                <button className={`auth-tab ${isLogin?"active": ""}`} onClick={()=>setIsLogin(true)}>
                    Login
                </button>
                <button className={`auth-tab ${!isLogin? "active" : ""}`} onClick={()=>setIsLogin(false)}>
                    Register
                </button>
            </div>
            <form onSubmit={handleSubmit} className='auth-form'>
            {errors.general && <div className='error-message'>{errors.general}</div>}
            <div className='form-group'>
                <label htmlFor='username'>Username</label>
                <input 
                id='username'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                className={errors.username ? "error" : ""}
                type='text'
                placeholder='Enter your username'   
                />
                {errors.username && <span className='field-error'>{errors.username}</span>}
            </div>

            {!isLogin&&(
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? "error" : ""}
                    placeholder='Enter your emial'
                    />{errors.email}
                </div>
            )}

            </form>
            
        </div>
        
    </div>
  )
}

export default Home