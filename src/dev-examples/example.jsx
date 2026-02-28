function App() {
    return (
        <div className="container">
            {/* JSX comment */}
            <header>
                <Typography variant="h1">Dev example doc</Typography> // JSX comment
            </header>
            <main>
                {items.map(item => (
                    <Card 
                        key={item.id}
                        className="card" // JSX comment
                    >
                        <div>
                            <ul>
                                <li>item.id</li>
                                <li>item.title</li>
                                <li/>
                            </ul>
                            <br  />
                        </div>
                        <div>
                            <Typography variant="h2">
                                {item.title}
                            </Typography>
                        </div>
                        <div><img /><br/></div>
                    </Card>
                ))}
            </main>
        </div>
    );
}