import { Typography } from "@mui/material";
import Container from "@mui/material/Container";

const App = () => {
	return (
		<Container
			maxWidth="xl"
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Typography
				variant="h4"
				sx={{
					color: "#333",
					fontWeight: "bold",
					textAlign: "center",
					marginBottom: 2,
				}}
			>
				Welcome to Movie-Party app!
			</Typography>
		</Container>
	);
};

export default App;
