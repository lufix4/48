{
  "remarks": "CX-Unlimited WO-SE",
  "version": {
    "min": "26.2.6"
  },
  "log": {
    "loglevel": "warning"
  },
  "dns": {
    "servers": [
      "fakedns",
      {
        "address": "https://8.8.8.8/dns-query",
        "tag": "remote-dns"
      }
    ],
    "queryStrategy": "UseIP",
    "tag": "dns"
  },
  "inbounds": [
    {
      "listen": "127.0.0.1",
      "port": 10808,
      "protocol": "mixed",
      "settings": {
        "auth": "noauth",
        "udp": true
      },
      "sniffing": {
        "destOverride": [
          "http",
          "tls",
          "fakedns"
        ],
        "enabled": true,
        "routeOnly": true
      },
      "tag": "mixed-in"
    },
    {
      "listen": "127.0.0.1",
      "port": 10853,
      "protocol": "dokodemo-door",
      "settings": {
        "address": "1.1.1.1",
        "network": "tcp,udp",
        "port": 53
      },
      "tag": "dns-in"
    },
    {
      "protocol": "tun",
      "settings": {
        "mtu": 1500,
        "name": "xray0",
        "userLevel": 8
      },
      "sniffing": {
        "destOverride": [
          "http",
          "tls",
          "quic"
        ],
        "enabled": true
      },
      "tag": "tun"
    }
  ],
  "outbounds": [
    {
      "protocol": "vless",
      "settings": {
        "vnext": [
          {
            "address": "70.34.207.141",
            "port": 443,
            "users": [
              {
                "id": "5575ff02-09a2-4ca0-bed9-7ef9e8bd147b",
                "flow": "xtls-rprx-vision",
                "encryption": "none"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "tcp",
        "rawSettings": {
          "header": {
            "type": "none"
          }
        },
        "security": "reality",
        "realitySettings": {
          "serverName": "www.lovelive-anime.jp",
          "fingerprint": "chrome",
          "publicKey": "EtKRG8sxUJsdy-KwUOtYUNJnSn5VMx2sfKvvdpzg2X0",
          "shortId": "f0eb800bd980b00b",
          "show": false,
          "allowInsecure": false
        },
        "sockopt": {
          "domainStrategy": "UseIPv4",
          "dialerProxy": "proxy"
        }
      },
      "tag": "chain"
    },
    {
      "protocol": "vless",
      "settings": {
        "vnext": [
          {
            "address": "104.16.73.147",
            "port": 2087,
            "users": [
              {
                "id": "b62c56b1-4994-40f3-8708-99f93bbded63",
                "encryption": "none"
              }
            ]
          }
        ]
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "host": "cx-Ii7MKo.IrunKNowN.WorkeRs.dev",
          "path": "/WYCR6is7CEyY?ed=2560"
        },
        "security": "tls",
        "tlsSettings": {
          "serverName": "cx-Ii7MKo.IrunKNowN.WorkeRs.dev",
          "fingerprint": "chrome",
          "alpn": [
            "http/1.1"
          ]
        },
        "sockopt": {
          "domainStrategy": "UseIP",
          "happyEyeballs": {
            "tryDelayMs": 250,
            "prioritizeIPv6": false,
            "interleave": 2,
            "maxConcurrentTry": 4
          }
        },
        "finalmask": {
          "tcp": [
            {
              "type": "fragment",
              "settings": {
                "packets": "tlshello",
                "length": "10-30",
                "delay": "1-2"
              }
            }
          ]
        }
      },
      "tag": "proxy"
    },
    {
      "protocol": "dns",
      "settings": {
        "rules": [
          {
            "action": "hijack"
          }
        ]
      },
      "tag": "dns-out"
    },
    {
      "protocol": "freedom",
      "settings": {
        "domainStrategy": "UseIP"
      },
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "settings": {
        "response": {
          "type": "http"
        }
      },
      "tag": "block"
    }
  ],
  "routing": {
    "domainStrategy": "IPIfNonMatch",
    "rules": [
      {
        "inboundTag": [
          "mixed-in"
        ],
        "port": 53,
        "outboundTag": "dns-out",
        "type": "field"
      },
      {
        "inboundTag": [
          "dns-in"
        ],
        "outboundTag": "dns-out",
        "type": "field"
      },
      {
        "inboundTag": [
          "remote-dns"
        ],
        "outboundTag": "proxy",
        "type": "field"
      },
      {
        "inboundTag": [
          "dns"
        ],
        "outboundTag": "direct",
        "type": "field"
      },
      {
        "domain": [
          "geosite:private"
        ],
        "outboundTag": "direct",
        "type": "field"
      },
      {
        "ip": [
          "geoip:private"
        ],
        "outboundTag": "direct",
        "type": "field"
      },
      {
        "network": "udp",
        "outboundTag": "block",
        "type": "field"
      },
      {
        "network": "tcp",
        "outboundTag": "chain",
        "type": "field"
      }
    ]
  },
  "policy": {
    "levels": {
      "0": {
        "connIdle": 300,
        "handshake": 4,
        "uplinkOnly": 1,
        "downlinkOnly": 1
      }
    },
    "system": {
      "statsOutboundUplink": true,
      "statsOutboundDownlink": true
    }
  },
  "stats": {}
}
