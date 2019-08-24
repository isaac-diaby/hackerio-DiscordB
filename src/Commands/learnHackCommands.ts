import * as Discord from "discord.js";
import { DiscordCommand } from "./DiscordCommand";

export interface IhackingScripts {
  primaryCmd: string;
  description: string;
  program: "Metasploitable";
}

export class LearnCommand extends DiscordCommand {
  // https://null-byte.wonderhowto.com/how-to/hack-like-pro-ultimate-command-cheat-sheet-for-metasploits-meterpreter-0149146/
  // https://null-byte.wonderhowto.com/how-to/hack-like-pro-ultimate-list-hacking-scripts-for-metasploits-meterpreter-0149339/
  static HACKER_SCRIPTS: Array<IhackingScripts[]> = [
    [
      {
        program: "Metasploitable",
        primaryCmd: "background",
        description: "moves the current session to the background"
      },
      {
        program: "Metasploitable",
        primaryCmd: "bgkill",
        description: "kills a background meterpreter script"
      },
      {
        program: "Metasploitable",
        primaryCmd: "bglist",
        description: "provides a list of all running background scripts"
      },
      {
        program: "Metasploitable",
        primaryCmd: "bgrun",
        description: "runs a script as a background thread"
      },
      {
        program: "Metasploitable",
        primaryCmd: "channel",
        description: "displays active channels"
      },
      {
        program: "Metasploitable",
        primaryCmd: "close",
        description: "closes a channel"
      },
      {
        program: "Metasploitable",
        primaryCmd: "exit",
        description: "terminates a meterpreter session"
      },
      {
        program: "Metasploitable",
        primaryCmd: "exploit",
        description: "executes the meterpreter script designated after it"
      },
      {
        program: "Metasploitable",
        primaryCmd: "help",
        description: "help menu"
      },
      {
        program: "Metasploitable",
        primaryCmd: "interact",
        description: "interacts with a channel"
      },
      {
        program: "Metasploitable",
        primaryCmd: "irb",
        description: "go into Ruby scripting mode"
      },
      {
        program: "Metasploitable",
        primaryCmd: "migrate",
        description: "moves the active process to a designated PID"
      },
      {
        program: "Metasploitable",
        primaryCmd: "quit",
        description: "terminates the meterpreter session"
      },
      {
        program: "Metasploitable",
        primaryCmd: "read",
        description: "reads the data from a channel"
      },
      {
        program: "Metasploitable",
        primaryCmd: "use",
        description: "loads a meterpreter extension"
      },
      {
        program: "Metasploitable",
        primaryCmd: "write",
        description: "writes data to a channel"
      },
      {
        program: "Metasploitable",
        primaryCmd: "cat",
        description: "read and output to stdout the contents of a file"
      },
      {
        program: "Metasploitable",
        primaryCmd: "cd",
        description: "change directory on the victim"
      },
      {
        program: "Metasploitable",
        primaryCmd: "del",
        description: "delete a file on the victim"
      },
      {
        program: "Metasploitable",
        primaryCmd: "download",
        description:
          "download a file from the victim system to the attacker system"
      },
      {
        program: "Metasploitable",
        primaryCmd: "edit",
        description: "edit a file with vim"
      },
      {
        program: "Metasploitable",
        primaryCmd: "getlwd",
        description: "print the local directory"
      },
      {
        program: "Metasploitable",
        primaryCmd: "lcd",
        description: "change local directory"
      },
      {
        program: "Metasploitable",
        primaryCmd: "lpwd",
        description: "print local directory"
      },
      {
        program: "Metasploitable",
        primaryCmd: "ls",
        description: "list files in current directory"
      },
      {
        program: "Metasploitable",
        primaryCmd: "mkdir",
        description: "make a directory on the victim system"
      },
      {
        program: "Metasploitable",
        primaryCmd: "pwd",
        description: "print working directory"
      },
      {
        program: "Metasploitable",
        primaryCmd: "rm",
        description: "delete (remove) a file"
      },
      {
        program: "Metasploitable",
        primaryCmd: "rmdir",
        description: "remove directory on the victim system"
      },
      {
        program: "Metasploitable",
        primaryCmd: "upload",
        description: "upload a file from the attacker system to the victim"
      },
      {
        program: "Metasploitable",
        primaryCmd: "route",
        description: "view or modify the victim routing table"
      },
      {
        program: "Metasploitable",
        primaryCmd: "execute",
        description: "executes a command"
      },
      {
        program: "Metasploitable",
        primaryCmd: "getpid",
        description: "gets the current process ID (PID)"
      },
      {
        program: "Metasploitable",
        primaryCmd: "getuid",
        description: "get the user that the server is running as"
      },
      {
        program: "Metasploitable",
        primaryCmd: "kill",
        description: "terminate the process designated by the PID"
      },
      {
        program: "Metasploitable",
        primaryCmd: "ps",
        description: "list running processes"
      },
      {
        program: "Metasploitable",
        primaryCmd: "reboot",
        description: "reboots the victim computer"
      },
      {
        program: "Metasploitable",
        primaryCmd: "reg",
        description: "interact with the victim's registry"
      },
      {
        program: "Metasploitable",
        primaryCmd: "shell",
        description: "opens a command shell on the victim machine"
      },
      {
        program: "Metasploitable",
        primaryCmd: "shutdown",
        description: "shuts down the victim's computer"
      },
      {
        program: "Metasploitable",
        primaryCmd: "screenshot",
        description: "grabs a screenshot of the meterpreter desktop"
      }
    ],
    [
      {
        program: "Metasploitable",
        primaryCmd: "portfwd",
        description: "forwards a port on the victim system to a remote service"
      },
      {
        program: "Metasploitable",
        primaryCmd: "clearev",
        description: "clears the event logs on the victim's computer"
      },
      {
        program: "Metasploitable",
        primaryCmd: "drop_token",
        description: "drops a stolen token"
      },
      {
        program: "Metasploitable",
        primaryCmd: "ipconfig",
        description:
          "displays network interfaces with key information including IP address, etc."
      },
      {
        program: "Metasploitable",
        primaryCmd: "getprivs",
        description: "gets as many privileges as possible"
      },
      {
        program: "Metasploitable",
        primaryCmd: "sysinfo",
        description:
          "gets the details about the victim computer such as OS and name"
      },
      {
        program: "Metasploitable",
        primaryCmd: "keyscan_dump",
        description: "dumps the contents of the software keylogger"
      },
      {
        program: "Metasploitable",
        primaryCmd: "keyscan_start",
        description:
          "starts the software keylogger when associated with a process such as Word or browser"
      },
      {
        program: "Metasploitable",
        primaryCmd: "keyscan_stop",
        description: "stops the software keylogger"
      }
    ],
    [
      {
        program: "Metasploitable",
        primaryCmd: "rev2self",
        description: "calls RevertToSelf() on the victim machine"
      },
      {
        program: "Metasploitable",
        primaryCmd: "steal_token",
        description: "attempts to steal the token of a specified (PID) process"
      },
      {
        program: "Metasploitable",
        primaryCmd: "enumdesktops",
        description: "lists all accessible desktops"
      },
      {
        program: "Metasploitable",
        primaryCmd: "getdesktop",
        description: "get the current meterpreter desktop"
      },
      {
        program: "Metasploitable",
        primaryCmd: "idletime",
        description:
          "checks to see how long since the victim system has been idle"
      },
      {
        program: "Metasploitable",
        primaryCmd: "set_desktop",
        description: "changes the meterpreter desktop"
      },
      {
        program: "Metasploitable",
        primaryCmd: "uictl",
        description: "enables control of some of the user interface components"
      },
      {
        program: "Metasploitable",
        primaryCmd: "getsystem",
        description: "uses 15 built-in methods to gain sysadmin privileges"
      },
      {
        program: "Metasploitable",
        primaryCmd: "hashdump",
        description: "grabs the hashes in the password (SAM) file"
      },
      {
        program: "Metasploitable",
        primaryCmd: "timestomp",
        description:
          "manipulates the modify, access, and create attributes of a file"
      },
      {
        program: "Metasploitable",
        primaryCmd: "arp_scanner.rb",
        description: "Script for performing an ARP's Scan Discovery."
      },
      {
        program: "Metasploitable",
        primaryCmd: "autoroute.rb",
        description:
          "Meterpreter session without having to background the current session."
      },
      {
        program: "Metasploitable",
        primaryCmd: "checkvm.rb",
        description: "Script for detecting if target host is a virtual machine."
      },
      {
        program: "Metasploitable",
        primaryCmd: "credcollect.rb",
        description:
          "Script to harvest credentials found on the host and store them in the database."
      },
      {
        program: "Metasploitable",
        primaryCmd: "domain_list_gen.rb",
        description: "Script for extracting domain admin account list for use."
      },
      {
        program: "Metasploitable",
        primaryCmd: "dumplinks.rb",
        description:
          "Dumplinks parses .lnk files from a user's recent documents folder and Microsoft Office's Recent documents folder, if present. The .lnk files contain time stamps, file locations, including share names, volume serial #s and more. This info may help you target additional systems."
      },
      {
        program: "Metasploitable",
        primaryCmd: "duplicate.rb",
        description:
          'Uses a meterpreter session to spawn a new meterpreter session in a different process. A new process allows the session to take "risky" actions that might get the process killed by A/V, giving a meterpreter session to another controller, or start a keylogger on another process.'
      },
      {
        program: "Metasploitable",
        primaryCmd: "enum_chrome.rb",
        description: "Script to extract data from a chrome installation."
      },
      {
        program: "Metasploitable",
        primaryCmd: "enum_firefox.rb",
        description:
          "Script for extracting data from Firefox. enum_logged_on_users.rb - Script for enumerating current logged users and users that have logged in to the system."
      },
      {
        program: "Metasploitable",
        primaryCmd: "enum_powershell_env.rb",
        description: "Enumerates PowerShell and WSH configurations."
      },
      {
        program: "Metasploitable",
        primaryCmd: "enum_putty.rb",
        description: "Enumerates Putty connections."
      },
      {
        program: "Metasploitable",
        primaryCmd: "enum_shares.rb",
        description:
          "Script for Enumerating shares offered and history of mounted shares."
      },
      {
        program: "Metasploitable",
        primaryCmd: "enum_vmware.rb",
        description: "Enumerates VMware configurations for VMware products."
      },
      {
        program: "Metasploitable",
        primaryCmd: "event_manager.rb",
        description:
          "Show information about Event Logs on the target system and their configuration."
      },
      {
        program: "Metasploitable",
        primaryCmd: "file_collector.rb",
        description:
          "Script for searching and downloading files that match a specific pattern."
      },
      {
        program: "Metasploitable",
        primaryCmd: "get_application_list.rb",
        description:
          "Script for extracting a list of installed applications and their version."
      },
      {
        program: "Metasploitable",
        primaryCmd: "getcountermeasure.rb",
        description:
          "Script for detecting AV, HIPS, Third Party Firewalls, DEP Configuration and Windows Firewall configuration. Provides also the option to kill the processes of detected products and disable the built-in firewall."
      },
      {
        program: "Metasploitable",
        primaryCmd: "get_env.rb",
        description:
          "Script for extracting a list of all System and User environment variables."
      },
      {
        program: "Metasploitable",
        primaryCmd: "getfilezillacreds.rb",
        description:
          "Script for extracting servers and credentials from Filezilla."
      },
      {
        program: "Metasploitable",
        primaryCmd: "getgui.rb",
        description: "Script to enable Windows RDP."
      },
      {
        program: "Metasploitable",
        primaryCmd: "get_local_subnets.rb",
        description: "Get a list of local subnets based on the host's routes."
      },
      {
        program: "Metasploitable",
        primaryCmd: "get_pidgen_creds.rb",
        description:
          "Script for extracting configured services with username and passwords."
      },
      {
        program: "Metasploitable",
        primaryCmd: "gettelnet.rb",
        description: "Checks to see whether telnet is installed."
      },
      {
        program: "Metasploitable",
        primaryCmd: "get_valid_community.rb",
        description: "Gets a valid community string from SNMP."
      },
      {
        program: "Metasploitable",
        primaryCmd: "getvncpw.rb",
        description: "Gets the VNC password."
      },
      {
        program: "Metasploitable",
        primaryCmd: "hashdump.rb",
        description: "Grabs password hashes from the SAM."
      },
      {
        program: "Metasploitable",
        primaryCmd: "hostedit.rb",
        description: "Script for adding entries in to the Windows Hosts file."
      },
      {
        program: "Metasploitable",
        primaryCmd: "keylogrecorder.rb",
        description:
          "Script for running keylogger and saving all the keystrokes."
      },
      {
        program: "Metasploitable",
        primaryCmd: "killav.rb",
        description: "Terminates nearly every antivirus software on victim."
      },
      {
        program: "Metasploitable",
        primaryCmd: "metsvc.rb",
        description: "Delete one meterpreter service and start another."
      },
      {
        program: "Metasploitable",
        primaryCmd: "migrate -",
        description: "the meterpreter service to another process."
      },
      {
        program: "Metasploitable",
        primaryCmd: "multicommand.rb",
        description:
          "Script for running multiple commands on Windows 2003, Windows Vistaand Windows XP and Windows 2008 targets."
      },
      {
        program: "Metasploitable",
        primaryCmd: "multi_console_command.rb",
        description:
          "Script for running multiple console commands on a meterpreter session."
      },
      {
        program: "Metasploitable",
        primaryCmd: "multi_meter_inject.rb",
        description:
          "Script for injecting a reverce tcp Meterpreter Payload into memory of multiple PIDs, if none is provided a notepad process will be created and a Meterpreter Payload will be injected in to each."
      },
      {
        program: "Metasploitable",
        primaryCmd: "multiscript.rb",
        description:
          "Script for running multiple scripts on a Meterpreter session."
      },
      {
        program: "Metasploitable",
        primaryCmd: "netenum.rb",
        description:
          "Script for ping sweeps on Windows 2003, Windows Vista, Windows 2008 and Windows XP targets using native Windows commands."
      },
      {
        program: "Metasploitable",
        primaryCmd: "packetrecorder.rb",
        description: "Script for capturing packets in to a PCAP file."
      },
      {
        program: "Metasploitable",
        primaryCmd: "panda2007pavsrv51.rb",
        description:
          "This module exploits a privilege escalation vulnerability in Panda Antivirus 2007. Due to insecure permission issues, a local attacker can gain elevated privileges."
      },
      {
        program: "Metasploitable",
        primaryCmd: "persistence.rb",
        description:
          "Script for creating a persistent backdoor on a target host."
      },
      {
        program: "Metasploitable",
        primaryCmd: "pml_driver_config.rb",
        description:
          "Exploits a privilege escalation vulnerability in Hewlett-Packard's PML Driver HPZ12. Due to an insecure SERVICE_CHANGE_CONFIG DACL permission, a local attacker can gain elevated privileges."
      },
      {
        program: "Metasploitable",
        primaryCmd: "powerdump.rb",
        description:
          "Meterpreter script for utilizing purely PowerShell to extract username and password hashes through registry keys. This script requires you to be running as system in order to work properly. This has currently been tested on Server 2008 and Windows 7, which installs PowerShell by default."
      },
      {
        program: "Metasploitable",
        primaryCmd: "prefetchtool.rb",
        description:
          "Script for extracting information from windows prefetch folder."
      },
      {
        program: "Metasploitable",
        primaryCmd: "process_memdump.rb",
        description:
          "Script is based on the paper Neurosurgery With Meterpreter."
      },
      {
        program: "Metasploitable",
        primaryCmd: "remotewinenum.rb",
        description:
          "This script will enumerate windows hosts in the target environment given a username and password or using the credential under which Meterpeter is running using WMI wmic windows native tool."
      },
      {
        program: "Metasploitable",
        primaryCmd: "scheduleme.rb",
        description:
          "Script for automating the most common scheduling tasks during a pentest. This script works with Windows XP, Windows 2003, Windows Vista and Windows 2008."
      },
      {
        program: "Metasploitable",
        primaryCmd: "schelevator.rb",
        description:
          "Exploit for Windows Vista/7/2008 Task Scheduler 2.0 Privilege Escalation. This script exploits the Task Scheduler 2.0 XML 0day exploited by Stuxnet."
      },
      {
        program: "Metasploitable",
        primaryCmd: "schtasksabuse.rb",
        description:
          "Meterpreter script for abusing the scheduler service in Windows by scheduling and running a list of command against one or more targets. Using schtasks command to run them as system. This script works with Windows XP, Windows 2003, Windows Vista and Windows 2008."
      },
      {
        program: "Metasploitable",
        primaryCmd: "scraper.rb",
        description:
          "The goal of this script is to obtain system information from a victim through an existing Meterpreter session."
      },
      {
        program: "Metasploitable",
        primaryCmd: "screenspy.rb",
        description:
          "This script will open an interactive view of remote hosts. You will need Firefox installed on your machine."
      },
      {
        program: "Metasploitable",
        primaryCmd: "screen_unlock.rb",
        description:
          "Script to unlock a windows screen. Needs system privileges to run and known signatures for the target system."
      },
      {
        program: "Metasploitable",
        primaryCmd: "screen_dwld.rb",
        description:
          "Script that recursively search and download files matching a given pattern."
      },
      {
        program: "Metasploitable",
        primaryCmd: "service_manager.rb",
        description: "Script for managing Windows services."
      },
      {
        program: "Metasploitable",
        primaryCmd: "service_permissions_escalate.rb",
        description:
          "script attempts to create a service, then searches through a list of existing services to look for insecure file or configuration permissions that will let it replace the executable with a payload. It will then attempt to restart the replaced service to run the payload. If that fails, the next time the service is started (such as on reboot) the attacker will gain elevated privileges."
      },
      {
        program: "Metasploitable",
        primaryCmd: "sound_recorder.rb",
        description:
          "Script for recording in intervals the sound capture by a target host microphone."
      },
      {
        program: "Metasploitable",
        primaryCmd: "srt_webdrive_priv.rb",
        description:
          "Exploits a privilege escalation vulnerability in South River Technologies WebDrive."
      },
      {
        program: "Metasploitable",
        primaryCmd: "uploadexec.rb",
        description: "Script to upload executable file to host."
      },
      {
        program: "Metasploitable",
        primaryCmd: "virtualbox_sysenter_dos -",
        description: "to DoS Virtual Box."
      },
      {
        program: "Metasploitable",
        primaryCmd: "virusscan_bypass.rb",
        description:
          "Script that kills Mcafee VirusScan Enterprise v8.7.0i+ processes."
      },
      {
        program: "Metasploitable",
        primaryCmd: "vnc.rb",
        description: "Meterpreter script for obtaining a quick VNC session."
      },
      {
        program: "Metasploitable",
        primaryCmd: "webcam.rb",
        description: "Script to enable and capture images from the host webcam."
      },
      {
        program: "Metasploitable",
        primaryCmd: "win32-sshclient.rb",
        description:
          'Script to deploy & run the "plink" commandline ssh-client. Supports only MS-Windows-2k/XP/Vista Hosts.'
      },
      {
        program: "Metasploitable",
        primaryCmd: "win32-sshserver.rb",
        description: "Script to deploy and run OpenSSH on the target machine."
      },
      {
        program: "Metasploitable",
        primaryCmd: "winbf.rb",
        description:
          "Function for checking the password policy of current system. This policy may resemble the policy of other servers in the target environment."
      },
      {
        program: "Metasploitable",
        primaryCmd: "winenum.rb",
        description:
          "Enumerates Windows system including environment variables, network interfaces, routing, user accounts, etc"
      },
      {
        program: "Metasploitable",
        primaryCmd: "wmic.rb",
        description:
          "Script for running WMIC commands on Windows 2003, Windows Vista and Windows XP and Windows 2008 targets."
      }
    ]
  ];
  constructor(
    client: Discord.Client,
    message: Discord.Message,
    cmdArguments: Array<string>
  ) {
    super(client, message, cmdArguments);
    let page: number;
    try {
      page = this.args[0] !== undefined ? parseInt(this.args[0], 10) : 1;
      this.openLearningBook(page);
    } catch (e) {
      this.getCommandInfo(this.args[0]);
    }
  }
  getCommandInfo(primeCmd: string) {
    const flatten = [
      ...LearnCommand.HACKER_SCRIPTS[0],
      ...LearnCommand.HACKER_SCRIPTS[1],
      ...LearnCommand.HACKER_SCRIPTS[2]
    ];
    const selectedCmd = flatten.filter(
      script => script.primaryCmd === primeCmd
    )[0];
    if (selectedCmd === undefined)
      return this.sendMsgViaDm("could not find this command");
    const Msg = new Discord.RichEmbed()
      .setColor("#3BB2E2")
      .addField("Command", selectedCmd.primaryCmd, true)
      .addField("Program", selectedCmd.program, true)
      .addField("Description", selectedCmd.description, true)
      .addBlankField(true);
    this.sendMsgViaDm(Msg);
  }
  openLearningBook(page: number) {
    //@ts-ignore
    this.sendMsgViaDm(this.GetPage(page)).then((m: Discord.Message) => {
      m.react("👈").then(mr => {
        m.react("👉");
        const backWordsFilter = (r: Discord.MessageReaction, u: Discord.User) =>
          r.emoji.name === "👈" && u.id === this.msg.author.id;
        const forWordsFilter = (r: Discord.MessageReaction, u: Discord.User) =>
          r.emoji.name === "👉" && u.id === this.msg.author.id;

        const backWords = m.createReactionCollector(backWordsFilter, {
          time: 60000
        });
        const forWords = m.createReactionCollector(forWordsFilter, {
          time: 60000
        });

        backWords.on("collect", r => {
          if (page === 1) return;
          page--;
          m.edit(this.GetPage(page));
        });
        forWords.on("collect", r => {
          if (page === this.joinAllLearningCommandAndSmaller().length) return;
          page++;
          m.edit(this.GetPage(page));
        });
      });
    });
  }
  GetPage(page: number) {
    const newSplitArray = this.joinAllLearningCommandAndSmaller();
    // console.log(newSplitArray)
    const Msg = new Discord.RichEmbed()
      .setColor("#3BB2E2")
      .setTitle(`Commands Dictionary`)
      .setFooter(`Page ${page} of ${newSplitArray.length}`);
    newSplitArray[page - 1].forEach(script => {
      // console.log(script)
      Msg.addField("Command", script.primaryCmd, true)
        .addField("Program", script.program, true)
        .addField("Description", script.description, true)
        .addBlankField();
    });
    return Msg;
  }
  /**
   * Getting the commands in a format that can be printed out with less than 25 discord fields
   */
  joinAllLearningCommandAndSmaller() {
    const flatten = [
      ...LearnCommand.HACKER_SCRIPTS[0],
      ...LearnCommand.HACKER_SCRIPTS[1],
      ...LearnCommand.HACKER_SCRIPTS[2]
    ];
    // console.log(flatten)
    const splitBy = 5;
    let newSplitArray = [];
    for (let i = 0; i < flatten.length; i += splitBy) {
      newSplitArray.push(flatten.slice(i, i + splitBy));
    }
    return newSplitArray;
  }
}
