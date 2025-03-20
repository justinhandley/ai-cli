from commands import search

# Add the search commands to the main app
app.add_typer(search.app, name="search", help="Search for code solutions and troubleshooting") 