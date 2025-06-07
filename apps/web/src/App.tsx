import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";

const App = () => {
	return (
		<Container
			maxWidth="xl"
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "start",
				paddingTop: "4rem",
			}}
		>
			<Card
				component="section"
				sx={{
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					backdropFilter: "blur(10px)",
					WebkitBackdropFilter: "blur(10px)",
					borderRadius: 12,
					border: "1px solid rgba(255, 255, 255, 0.2)",
					boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
					padding: 2,
					color: "#fff",
					textAlign: "center",
					height: "35rem",
					width: "59rem",
					maxWidth: "75vw",
				}}
			>
				<Box
					sx={{
						width: "100%",
						height: "3rem",
						bgcolor: "#232F3E",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						borderRadius: 7,
						paddingY: 2,
					}}
				>
					<Typography
						variant="h4"
						sx={{
							fontWeight: "bold",
							textAlign: "center",
						}}
					>
						Welcome to Movie-Party app!
					</Typography>
				</Box>
			</Card>
		</Container>
	);
};

export default App;
