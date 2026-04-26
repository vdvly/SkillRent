export function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
    }}>
      <div className="spinner"></div>
    </div>
  );
}

export default Loading;
