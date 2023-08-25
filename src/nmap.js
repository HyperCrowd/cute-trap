const nmap = require('node-port-scanner')
const commonPorts = [
  20, // FTP Data
  21, // FTP Control
  22, // SSH
  23, // Telnet
  25, // SMTP
  53, // DNS
  67, // DHCP Server
  68, // DHCP Client
  69, // TFTP
  80, // HTTP
  88, // Kerberos
  110, // POP3
  115, // SFTP
  119, // NNTP
  123, // NTP
  135, // Microsoft RPC
  137, // NetBIOS Name Service
  138, // NetBIOS Datagram Service
  139, // NetBIOS Session Service
  143, // IMAP
  161, // SNMP
  162, // SNMP Trap
  179, // BGP (Border Gateway Protocol)
  194, // IRC
  443, // HTTPS
  445, // Microsoft-DS (SMB)
  465, // SMTPS
  514, // Syslog
  587, // SMTP (Submission)
  636, // LDAPS
  993, // IMAPS
  995, // POP3S
  1080, // SOCKS Proxy
  1433, // MSSQL
  1521, // Oracle DB
  1723, // PPTP
  1883, // MQTT
  3306, // MySQL
  3389, // RDP (Remote Desktop Protocol)
  5060, // SIP
  5432, // PostgreSQL
  5900, // VNC (Virtual Network Computing)
  6379, // Redis
  8080, // HTTP Alternate
  8443 // HTTPS Alternate
]

exports.checkPorts = async function (ip) {
  return new Promise((resolve, reject) => {
    nmap(ip, commonPorts)
      .then((report) => {
        resolve(report)
      })
      .catch(err => {
        console.error(err)
      })
  })
}
