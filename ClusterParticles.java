package com.company;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.opensourcephysics.display.Drawable;
import org.opensourcephysics.display.DrawingPanel;
import org.opensourcephysics.numerics.ODE;
import org.opensourcephysics.numerics.Verlet;

import java.awt.*;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

public class ClusterParticles implements Drawable, ODE {

    public boolean dataImported = false;
    public double state[];
    public boolean edges[][];
    public double ax[], ay[];
    public int N, nx, ny; // number of particles, number per row, number per column
    public double Lx, Ly;
    public double rho = N/(Lx*Ly);
    public int steps = 0;
    public double dt = 0.01;
    public double t;
    public double radius = 0.5; // radius of particles on screen
    public double initialVelocitySum;
    public boolean steadyStateAchieved = false;
    Verlet odeSolver = new Verlet(this);


    public void initialize() {
        if(!dataImported) {
            N = nx * ny;
            t = 0;
            rho = N / (Lx * Ly);
            resetSteps();
            state = new double[1 + 4 * N];
            ax = new double[N];
            ay = new double[N];
            edges = new boolean[N][N];
            steadyStateAchieved = false;

            setRandomPositions();
            setRandomEdges();
        }

        setVelocities();
        computeAcceleration();

        odeSolver.setStepSize(dt);
    }

    private void setVelocities() {
        // Assigning zero to every Velocity
        for(int i = 0;i<N;++i) {
            state[4*i+1] = 0;
            state[4*i+3] = 0;
        }
    }

    public void setRandomEdges(){
        for(int i = 0;i<N-1;i++) {
            for(int j = i+1;j<N;j++) {
                double randomNumber = Math.random();
                if(randomNumber < 0.3){
                    edges[i][j] = true;
                    edges[j][i] = true;
                }
            }
        }
    }

    public void setDataFromJSON(String path){
        //JSON parser object to parse read file
        JSONParser parser = new JSONParser();

        try
        {
            JSONObject jsonObject = (JSONObject) parser.parse(new FileReader(path));
            JSONArray points = (JSONArray) jsonObject.get("points");

            N = points.size();
            t = 0;
            rho = N/(Lx*Ly);
            resetSteps();
            state = new double[1+4*N];
            ax = new double[N];
            ay = new double[N];
            edges = new boolean[N][N];

            for(int i = 0;i<N;++i) {
                JSONObject point = (JSONObject) points.get(i);
                state[4*i] = (Double) point.get("x");   // x
                state[4*i+2] = (Double) point.get("y"); // y
            }


            JSONArray edgesObj = (JSONArray) jsonObject.get("edges");

            for(int i = 0;i<N-1;i++) {
                JSONArray edgesLine = (JSONArray) edgesObj.get(i);
                for (int j = i + 1; j < N; j++) {
                    Boolean edgeExists = (Boolean) edgesLine.get(j);
                    if (edgeExists) {
                        edges[i][j] = true;
                    }
                }
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        dataImported = true;
    }

    public void setRandomPositions() { // particles placed at random, but not closer than rMinimumSquared
        double rMinimumSquared = Math.pow(2.0, 1.0/3.0);
        boolean overlap;
        for(int i = 0;i<N;++i) {
            do {
                overlap = false;
                state[4*i] = Lx/2 - 3 + 6*Math.random(); // x
                state[4*i+2] = Ly/2 - 3 + 6*Math.random(); // y
                int j = 0;
                while((j<i)&&!overlap) {
                    double dx = state[4*i]-state[4*j];
                    double dy = state[4*i+2]-state[4*j+2];
                    if(dx*dx+dy*dy<rMinimumSquared) {
                        overlap = true;
                    }
                    j++;
                }
            } while(overlap);
        }
    }

    public void computeAcceleration() {
        for(int i = 0;i<N;i++) {
            ax[i] = 0;
            ay[i] = 0;
        }
        for(int i = 0;i<N-1;i++) {
            for(int j = i+1;j<N;j++) {
                double dx = state[4*i]-state[4*j];
                double dy = state[4*i+2]-state[4*j+2];
                double r = Math.abs(dx*dx+dy*dy);
//                if(r2 == 0){
//                    r2 = 0.01;
//                }
//                double oneOverR2 = 1.0/r2;
//                double oneOverR6 = oneOverR2*oneOverR2*oneOverR2;
                double fOverR; //= 48.0*oneOverR6*(oneOverR6/*-0.5*/)*oneOverR2;

//                double multiplyer;
                if(edges[i][j]){
                    fOverR = -2*r;
                } else {
                    r = r/5;
                    fOverR = 250/(r);
                }

//                fOverR = 48.0*oneOverR6*multiplyer*oneOverR2;

                double fx = fOverR*dx; // force in x-direction
                double fy = fOverR*dy; // force in y-direction



                ax[i] += fx;           // use Newton's third law
                ay[i] += fy;
                ax[j] -= fx;
                ay[j] -= fy;
            }
        }
    }

    public void resetSteps() {
        steps = 0;
    }


    public void step() {
        odeSolver.step();
        steps++;
        t += dt;
        if((steps%2)==0){
            for(int i = 0; i<N; ++i) {
                state[4*i+1] = 0;
                state[4*i+3] = 0;
            }
        } else {
            if(steps == 1){
                for(int i = 0; i<N; ++i) {
                    initialVelocitySum += Math.abs(state[4*i+1]);
                    initialVelocitySum += Math.abs(state[4*i+3]);
                }
            } else {
                double newVelocitySum = 0;
                for(int i = 0; i<N; ++i) {
                    newVelocitySum += Math.abs(state[4*i+1]);
                    newVelocitySum += Math.abs(state[4*i+3]);
                }
                if(newVelocitySum/initialVelocitySum < 0.005)
                    steadyStateAchieved = true;
            }
        }
    }

    public void draw(DrawingPanel panel, Graphics g) {
        if(state==null) {
            return;
        }
        int pxRadius = Math.abs(panel.xToPix(radius)-panel.xToPix(0));
        int pyRadius = Math.abs(panel.yToPix(radius)-panel.yToPix(0));

        g.setColor(Color.green);
        for(int i = 0;i<N-1;i++) {
            for(int j = i+1;j<N;j++) {
                if (edges[i][j]){
                    int xpix = panel.xToPix(state[4 * i]);
                    int ypix = panel.yToPix(state[4 * i + 2]);

                    int xpix2 = panel.xToPix(state[4 * j]);
                    int ypix2 = panel.yToPix(state[4 * j + 2]);

                    g.drawLine(xpix, ypix, xpix2, ypix2);
//                    g.fillOval(xpix, ypix, 2 * pxRadius, 2 * pyRadius);
                }
            }
        }

        g.setColor(Color.red);
        for(int i = 0;i<N;i++) {
            int xpix = panel.xToPix(state[4*i])-pxRadius;
            int ypix = panel.yToPix(state[4*i+2])-pyRadius;
            g.fillOval(xpix, ypix, 2*pxRadius, 2*pyRadius);
        } // draw central cell boundary
        g.setColor(Color.black);
        int xpix = panel.xToPix(0);
        int ypix = panel.yToPix(Ly);
        int lx = panel.xToPix(Lx)-panel.xToPix(0);
        int ly = panel.yToPix(0)-panel.yToPix(Ly);
        g.drawRect(xpix, ypix, lx, ly);
    }

    public double[] getState() {
        return state;
    }

    public void getRate(double[] state, double[] rate) {
        if(odeSolver.getRateCounter()==1) {
            computeAcceleration();
        }
        for(int i = 0;i<N;i++) {
            rate[4*i] = state[4*i+1];   // rates for positions are velocities
            rate[4*i+2] = state[4*i+3]; // vy
            rate[4*i+1] = ax[i];        // rate for velocity is acceleration
            rate[4*i+3] = ay[i];
        }
        rate[4*N] = 1; // dt/dt = 1
    }
}
