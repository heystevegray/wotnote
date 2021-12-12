import { ReactElement } from 'react';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
	paper: {
		padding: theme.spacing(2),
		alignItems: 'center',
		justifyContent: 'center',
		maxWidth: 200,
	},
	container: {
		height: '100%',
		alignItems: 'center',
	},
}));

const Login = (): ReactElement => {
	const classes = useStyles();
	return (
		<Grid container justify="center" className={classes.container}>
			<Paper className={classes.paper}>
				<Grid container spacing={2} alignContent="center" justify="center">
					<Grid item xs={12}>
						<TextField required id="username" label="Username" />
					</Grid>
					<Grid item xs={12}>
						<TextField required id="password" label="Password" type="password" />
					</Grid>
					<Grid container item xs={12} justify="flex-end">
						<Button variant="contained" color="primary">
							Login
						</Button>
					</Grid>
				</Grid>
			</Paper>
		</Grid>
	);
};

export default Login;
