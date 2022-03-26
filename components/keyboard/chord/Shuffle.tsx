import { Button, Grid, Typography } from '@material-ui/core';
import { ShuffleOutlined } from '@material-ui/icons';
import { Container } from 'next/app';
import React, { useState } from 'react';
import Chord from './Chord';
import { ChordProps } from './Chords';

const Shuffle = ({ chords }: ChordProps) => {
    const [chordProgression, setChordProgression] = useState([1, 5, 6, 4]);

    const randomBetween = (min: number, max: number): number => {
        // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const handleShuffle = () => {
        const randomChordProgression = [];
        for (let index = 0; index < 4; index++) {
            console.log({ chords });

            const randomChordIndex = randomBetween(0, chords.length - 1);
            randomChordProgression.push(randomChordIndex);
        }
        setChordProgression(randomChordProgression);
    };

    return (
        <Container>
            <Grid container spacing={2}>
                <Grid container item xs={12} justify="center">
                    <Button color="primary" variant="contained" startIcon={<ShuffleOutlined />} onClick={handleShuffle}>
                        Shuffle
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography align="center">
                        Shuffle chords in this scale to generate a random chord progression.
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {chordProgression}
                </Grid>
                {chords
                    .map((chord, index) => (
                        <Grid container spacing={2} item xs={12} md={6} lg={3} key={`${chord.key}-${index}-shuffle`}>
                            <Grid item xs={12}>
                                <Chord chord={chord} chordIndex={index} />
                            </Grid>
                        </Grid>
                    ))
                    .filter((chord, index) => {
                        return chordProgression.includes(index);
                    })}
            </Grid>
        </Container>
    );
};

export default Shuffle;
