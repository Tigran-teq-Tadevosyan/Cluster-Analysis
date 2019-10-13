package com.company;

import org.opensourcephysics.controls.AbstractSimulation;
import org.opensourcephysics.controls.SimulationControl;
import org.opensourcephysics.display.GUIUtils;
import org.opensourcephysics.frames.DisplayFrame;

import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.util.ArrayList;

public class ClusterParticlesApp extends AbstractSimulation {
    public boolean clusetCalculated = false;
    ClusterParticles md = new ClusterParticles();
    DisplayFrame display = new DisplayFrame("x", "y", "Cluster Particales");

    public void initialize() {
        md.N_Input = control.getInt("N"); // number of particles per row
        md.edgeProbability = control.getDouble("Edge Probability");
        md.Lx = control.getDouble("Lx");
        md.Ly = control.getDouble("Ly");
        md.dt = control.getDouble("dt");
        clusetCalculated = false;
        md.initialize();
        display.addDrawable(md);
        display.setPreferredMinMax(0, md.Lx, 0, md.Ly); // assumes vmax = 2*initalTemp and bin width = Vmax/N
    }

    public void doStep() {
        if(clusetCalculated)
            return;
        if(md.steadyStateAchieved) {
            control.println("Steady State Achieved!");
            clusetCalculated = true;
            ArrayList<String> clusterStrings = md.calculateClusters();
            control.println("Cluster List:");
            for(String clusterString : clusterStrings){
                control.println(clusterString);
            }
        } else {
            md.step();
        }
    }

    public void stop() {
//        control.println("Density = "+decimalFormat.format(md.rho));
//        control.println("Number of time steps = "+md.steps);
//        control.println("Time step dt = "+decimalFormat.format(md.dt));
//        control.println("Velocity sum is: " + md.initialVelocitySum);
    }

    public void startRunning() {
        md.dt = control.getDouble("dt");
        double Lx = control.getDouble("Lx");
        double Ly = control.getDouble("Ly");
        if((Lx!=md.Lx)||(Ly!=md.Ly)) {
            md.Lx = Lx;
            md.Ly = Ly;
            md.computeAcceleration();
            display.setPreferredMinMax(0, Lx, 0, Ly);
            resetData();
        }
    }

    public void reset() {
        control.setValue("N", 40);
        control.setValue("Edge Probability", 0.3);
        control.setAdjustableValue("Lx", 50.0);
        control.setAdjustableValue("Ly", 50.0);
        control.setAdjustableValue("dt", 0.01);
        enableStepsPerDisplay(true);
        clusetCalculated = false;
        super.setStepsPerDisplay(10);  // draw configurations every 10 steps
        display.setSquareAspect(true); // so particles will appear as circular disks
    }

    public void resetData() {
        md.resetSteps();
        clusetCalculated = false;
        GUIUtils.clearDrawingFrameData(false); // clears old data from the plot frames
    }

    public void importInitialData(){
        JFileChooser chooser = new JFileChooser();
        FileNameExtensionFilter filter = new FileNameExtensionFilter(
                "JSON files", "json");
        chooser.setFileFilter(filter);
        int returnVal = chooser.showOpenDialog(null);
        if(returnVal == JFileChooser.APPROVE_OPTION) {
            md.setDataFromJSON(chooser.getSelectedFile().getAbsolutePath());
        }
    }

    public static void main(String[] args) {
        SimulationControl control = SimulationControl.createApp(new ClusterParticlesApp());
        control.addButton("resetData", "Reset Data");
        control.addButton("importInitialData", "Import Data");
    }
}
