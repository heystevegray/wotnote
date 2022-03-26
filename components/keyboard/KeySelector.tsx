import { Grid, FormControl, InputLabel, Select, MenuItem, createStyles, makeStyles } from '@material-ui/core';
import React, { Key, useContext } from 'react';
import { PIANO_KEYS, Scale, PIANO_SCALES } from '../../lib/classes/PianoScale';
import { KeyboardContext } from '../../providers/Keyboard';

const useStyles = makeStyles((theme) =>
    createStyles({
        formControl: {
            minWidth: 200,
        },
        keySelect: {
            justifyContent: 'flex-end',
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'center',
            },
        },
        scaleSelect: {
            justifyContent: 'flex-start',
            [theme.breakpoints.down('sm')]: {
                justifyContent: 'center',
            },
        },
    })
);

const KeySelector = () => {
    const classes = useStyles();
    const { pianoKey, scale, setPianoKey, setScale } = useContext(KeyboardContext);
    return (
        <Grid container item xs={12} spacing={2}>
            <Grid item container xs={12} md={6} className={classes.keySelect}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="key-label">Key</InputLabel>
                    <Select
                        labelId="key-label"
                        id="key"
                        value={pianoKey}
                        onChange={(event) => setPianoKey(event.target.value as Key)}
                    >
                        {PIANO_KEYS.map((pianoKey, index) => {
                            return (
                                <MenuItem key={pianoKey + index} value={pianoKey}>
                                    {pianoKey}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item container xs={12} md={6} className={classes.scaleSelect}>
                <FormControl className={classes.formControl}>
                    <InputLabel id="scale-label">Scale</InputLabel>
                    <Select
                        labelId="scale-label"
                        id="scale"
                        value={scale}
                        onChange={(event) => setScale(event.target.value as Scale)}
                    >
                        {PIANO_SCALES.map((pianoScale, index) => {
                            return (
                                <MenuItem key={pianoScale + index} value={pianoScale}>
                                    {pianoScale}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};

export default KeySelector;
