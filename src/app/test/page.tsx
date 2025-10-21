export default function TestPage() {
  return (
    <div style={{padding: '20px', backgroundColor: 'red'}}>
      <h1 style={{color: 'white'}}>Test Page - Inline Styles</h1>
      <p style={{color: 'white'}}>If you see this with red background, the page renders</p>
      <div className="p-8 bg-blue-500">
        <p className="text-white">If this is blue, Tailwind CSS is working</p>
      </div>
    </div>
  )
}
