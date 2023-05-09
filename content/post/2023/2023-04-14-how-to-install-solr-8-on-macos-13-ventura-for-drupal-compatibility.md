---
title: How to Install Solr 8 on macOS 13 Ventura for Drupal Compatibility.
description: "If you're using Drupal and need to install Solr for search functionality,
you might encounter compatibility issues with the latest Solr version available through Homebrew.
Solr 9's schema is not yet compatible with Drupal, so you'll need to install Solr 8 instead. In this guide,
I'll walk you through the process of installing Solr 8 on macOS 13 Ventura."
date: 2023-04-14
---

<p>You might have observed that the solr version included in the most recent homebrew package is 9.
However, its schema is currently not compatible with Drupal. Therefore, I will guide you on how to obtain version 8 of solr,
which is compatible with Drupal.</p>

<h2>Requirements</h2>

1. Homebrew
2. Java 8

<h2>Step 1: Install Java 8 using Homebrew</h2>

<p>If you haven't installed Homebrew, you can find the installation instructions at <a href="https://brew.sh/" target="_blank">https://brew.sh/</a>.
After installing Homebrew, open Terminal and run the following command to install Java 8:</p>

{{< highlight zsh >}}
brew install --cask adoptopenjdk/openjdk/adoptopenjdk8
{{< /highlight >}}

<h2>Step 2: Find the Java 8 installation path</h2>

<p>To find the path of the installed Java 8, run this command in Terminal:</p>

{{< highlight zsh >}}
/usr/libexec/java_home -v 1.8
{{< /highlight >}}

<p>Take note of the output, which should be something like /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home.</p>

<h2>Step 3: Set JAVA_HOME environment variable</h2>

<p>To set the JAVA_HOME environment variable, open your shell profile file (e.g., ~/.bash_profile, ~/.bashrc, or ~/.zshrc)
in a text editor and add the following line, replacing /path/to/java8 with the path you found in step 2:</p>

{{< highlight zsh >}}
export JAVA_HOME="/path/to/java8"
{{< /highlight >}}

<p>For example, if the path from step 2 was /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home,
the line you should add to your shell profile is:</p>

{{< highlight zsh >}}
export JAVA_HOME="/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home"
{{< /highlight >}}

<p>Save the file and close the text editor.</p>

<h2>Step 4: Apply changes</h2>

<p>Run the following command to apply the changes to the current session:</p>

{{< highlight zsh >}}
source ~/.zshrc
{{< /highlight >}}

<h2>Step 5: Verify Java version</h2>

<p>Verify that you're using the correct Java version by running:</p>

{{< highlight zsh >}}
java -version
{{< /highlight >}}

<h2>Step 6: Download solr 8</h2>

<p>Go to the <a href="https://archive.apache.org/dist/lucene/solr/8.9.0/" target="_blank">Apache Solr 8 archive</a>
and download the .tgz file for that version.</p>

<p>Extract the downloaded archive:
Open Terminal and navigate to the directory where the downloaded .tgz file is located. Extract the contents using the following command:</p>

{{< highlight zsh >}}
tar xzf solr-8.9.0.tgz
{{< /highlight >}}

<p>Replace solr-8.9.0.tgz with the name of the downloaded .tgz file.</p>

<p>Move the extracted directory to a desired location: You can move the extracted directory to a location of your choice.
For instance, you can move it to the /opt directory:</p>

{{< highlight zsh >}}
sudo mv solr-8.9.0 /opt/solr
{{< /highlight >}}

<h2>Step 7: Set up environment variables</h2>

<p>Add the Solr binary to your system's PATH by adding the following line to your shell profile (e.g., ~/.bash_profile, ~/.bashrc, or ~/.zshrc):</p>

{{< highlight zsh >}}
export PATH=$PATH:/opt/solr/bin
{{< /highlight >}}

<p>Save the file, and then run source ~/.bash_profile, source ~/.bashrc, or source ~/.zshrc (depending on which file you edited) to apply the changes immediately.<p>

<h2>Step 8: Start Solr</h2>

<p>Run the following command in Terminal to start Solr:</p>

{{< highlight zsh >}}
solr start
{{< /highlight >}}

<h2>Step 9: Verify Solr installation</h2>

<p>Check that Solr is running by opening a web browser and navigating to <a href="http://localhost:8983/solr/" target="_blank">http://localhost:8983/solr/</a>.
You should see the Solr admin dashboard.</p>

<h2>Step 10: Create Launch Daemon</h2>

<p>Now that solr is installed, you will have to start it everytime you restart the computer, to prevent that, we are going to create
a Launch Daemon that will launch the solr service automatically.</p>

<h3>Create a plist file</h3>

<p>Create a new file called org.apache.solr.plist using a text editor like nano or vim, and add the following content:</p>

{{< highlight xml >}}
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>org.apache.solr</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/solr/bin/solr</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/opt/solr/logs/solr.log</string>
    <key>StandardOutPath</key>
    <string>/opt/solr/logs/solr.log</string>
    <key>WorkingDirectory</key>
    <string>/opt/solr</string>
</dict>
</plist>
{{< /highlight >}}

<h3>Move the plist file to the LaunchAgents folder</h3>

<p>Copy the org.apache.solr.plist file to the ~/Library/LaunchAgents/ folder:</p>

{{< highlight zsh >}}
cp org.apache.solr.plist ~/Library/LaunchAgents/
{{< /highlight >}}

<h3>Load the launch agent</h3>

<p>Load the plist file to launchd:</p>

{{< highlight zsh >}}
launchctl load ~/Library/LaunchAgents/org.apache.solr.plist
{{< /highlight >}}

<p>Now, Solr should start automatically whenever you log in to your user account.
If you want to stop Solr from starting automatically, you can unload the plist file:</p>

{{< highlight zsh >}}
launchctl unload ~/Library/LaunchAgents/org.apache.solr.plist
{{< /highlight >}}