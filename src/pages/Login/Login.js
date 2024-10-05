import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      // 이메일/비밀번호로 로그인 시도
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login successful!');
      navigate('/');  // 로그인 성공 시 홈으로 이동
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // 사용자가 없으면 회원가입 처리
        handleSignUp();
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  const handleSignUp = async () => {
    const auth = getAuth();
    try {
      // 새로운 사용자 생성 (회원가입)
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created successfully! You are now logged in.');
      navigate('/');  // 가입 후 로그인 상태로 홈으로 이동
    } catch (error) {
      setError('Sign-up failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
