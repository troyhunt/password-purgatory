addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { searchParams } = new URL(request.url)
  let password = searchParams.get('password')
  let badPasswordMessage =
    'Password must not be used by another user in the platform' // Change the catch-all/final error message (ironic, frustrating, and impossible to check by the user)

  // The code below makes extensive use of JavaScript regular expressions.
  // See the documentation here:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

  if (Beelzebub.getValidChecks(password).length) {
    const infuriateResult = Beelzebub.infuriate(password)
    if (infuriateResult) {
      badPasswordMessage = infuriateResult.message
    }
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-type': 'application/json;charset=UTF-8',
  }

  const data = { message: badPasswordMessage }

  const json = JSON.stringify(data, null, 2)

  return new Response(json, { headers })
}

class InfuriationLevel {
  static Low = new InfuriationLevel('Low')
  static Moderate = new InfuriationLevel('Moderate')
  static High = new InfuriationLevel('High')
  static Ridiculous = new InfuriationLevel('Ridiculous')

  constructor(name) {
    this.name = name
  }
}

class Beelzebub {
  static checks = [
    {
      passwordIsInvalid: password =>
        password.match(/Homer|Marge|Bart|Lisa|Maggie/) === null,
      message:
        'Password must contain at least 1 primary Simpsons family character',
      infuriationLevel: InfuriationLevel.High,
    },
    {
      passwordIsInvalid: password => password.match(/[ÅåÄäÖöÆæØø]/) === null,
      message: 'Password must contain at least 1 Nordic character',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(/[\u0370-\u03ff\u1f00-\u1fff]/) === null,
      message: 'Password must contain at least 1 Greek character',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(/Peter|Lois|Chris|Meg|Brian|Stewie/) === null,
      message:
        'Password must contain at least 1 primary Griffin family character',
      infuriationLevel: InfuriationLevel.High,
    },
    {
      passwordIsInvalid: password => password.match(/42/) === null,
      message: 'Password must contain the answer to life, the universe, and everything',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(
          /:‑\)|:\)|:\-\]|:\]|:>|:\-\}|:\}|:o\)\)|:\^\)|=\]|=\)|:\]|:\->|:>|8\-\)|:\-\}|:\}|:o\)|:\^\)|=\]|=\)|:‑D|:D|B\^D|:‑\(|:\(|:‑<|:<|:‑\[|:\[|:\-\|\||>:\[|:\{|:\(|;\(|:\'‑\(|:\'\(|:=\(|:\'‑\)|:\'\)|:"D|:‑O|:O|:‑o|:o|:\-0|>:O|>:3|;‑\)|;\)|;‑\]|;\^\)|:‑P|:\-\/|:\/|:‑\.|>:|>:\/|:|:‑\||:\||>:‑\)|>:\)|\}:‑\)|>;‑\)|>;\)|>:3|\|;‑\)|:‑J|<:‑\||~:>/,
        ) === null,
      message: 'Password must contain at least one emoticon',
      infuriationLevel: InfuriationLevel.High,
    },
    {
      passwordIsInvalid: password =>
        []
          .concat(password.match(/[0-9]/g))
          .map(Number)
          .reduce((a, b) => a + b) %
          3 !==
        0,
      message:
        'Password when stripped of non-numeric characters must be a number divisible by 3',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password => password.match(/[ÄÜÖ\u1e9e]/) === null,
      message: 'Password must contain at least one upper case German Umlaut',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password => password.match(/dog$/) === null,
      message: 'Password must end with dog',
      infuriationLevel: InfuriationLevel.Moderate,
    },
    {
      passwordIsInvalid: password => password.match(/^cat/) === null,
      message: 'Password must start with cat',
      infuriationLevel: InfuriationLevel.Moderate,
    },
    {
      passwordIsInvalid: password =>
        password.match(
          /spring|summer|autumn|fall|winter/,
        ) === null,
      message:
        'Password must contain at least one season of the year',
      infuriationLevel: InfuriationLevel.Moderate,
    },
    {
      passwordIsInvalid: password =>
        password.match(
          /Luna|Deimos|Phobos|Amalthea|Callisto|Europa|Ganymede|Io|Dione|Enceladus|Hyperion|Iapetus|Mimas|Phoebe|Rhea|Tethys|Titan|Ariel|Miranda|Oberon|Titania|Umbriel|Nereid|Triton|Charon|Himalia|Carme|Ananke|Adrastea|Elara|Adrastea|Elara|Epimetheus|Callirrhoe|Kalyke|Thebe|Methone|Kiviuq|Ijiraq|Paaliaq|Albiorix|Erriapus|Pallene|Polydeuces|Bestla|Daphnis|Despina|Puck|Carpo|Pasiphae|Themisto|Cyllene|Isonoe|Harpalyke|Hermippe|Iocaste|Chaldene|Euporie/,
        ) === null,
      message:
        'Password must contain at least one named solarian planetary satellite',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(
          /Michael|Toby|Dwight|Pam|Jim|Meredith|Gabe|Kelly|Ryan|Jan|Robert|Oscar|Angela|Kevin|Darryl|Creed|Stanley|Phyllis|Bob|Andy|Erin|David|Nellie|Roy|Karen|Hank|Pete|Clark|Nate|Holly|Todd|Calvin|Val|Mose|Cathy|Helene|Deangelo/,
        ) === null,
      message:
        'Password must contain at least one cast member from The Office',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(/(?:[^1234569]*[1234569]){3}[^1234569]*/) === null,
      message:
        'Password must contain at least 3 digits from the first 10 decimal places of pi',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(/bobcat|Lynx rufus|L. rufus/) === null,
      message: 'Password must contain a bobcat',
      infuriationLevel: InfuriationLevel.High,
    },
    {
      passwordIsInvalid: password =>
        Object.values(
          [...password].reduce(
            (res, char) => ((res[char] = (res[char] || 0) + 1), res),
            {},
          ),
        ).some(x => x > 1),
      message: 'Password must contain only unique characters',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    // The empty message should be moved to a separate category if there are too many
    // Low responses to cycle through. For now it looks to be fine.
    {
      passwordIsInvalid: password => password.length === 0,
      message: 'Password cannot be empty',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => password.length < 8,
      message: 'Password must be at least 8 characters long',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => ( password.length < 12 || password.length > 16),
      message: 'Password must be 12-16 characters long',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => password.match(/\d+/) === null,
      message: 'Password must contain at least 1 number',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => password.match(/1$/) !== null,
      message: 'Password must not end in "1"',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => password.match(/!$/) !== null,
      message: 'Password must not end in "!"',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => password.match(/[A-Z]/) === null,
      message: 'Password must contain at least 1 uppercase character',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password => password.match(/[a-z]/) === null,
      message: 'Password must contain at least 1 lowercase character',
      infuriationLevel: InfuriationLevel.Low,
    },
    {
      passwordIsInvalid: password =>
        password.match(/Password\smust\scontain/) === null,
      message: 'Password must contain "Password must contain"',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(
          /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/,
        ) === null,
      message: 'Password must contain at least one emoji',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password => password != password.split("").reverse().join(""),
      message: 'Password must be a palindrome',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password =>
        password.match(/\u202E/) === null,
      message: 'Password must contain RLO character',
      infuriationLevel: InfuriationLevel.High,
    },
    {
      passwordIsInvalid: password =>
        password.match(/(.)\1/) !== null,
      message: 'Password must not contain consecutive characters',
      infuriationLevel: InfuriationLevel.Moderate,
    },
    {
      passwordIsInvalid: password =>
        password.match(
          /Pawn|Bishop|Knight|Rook|Queen|King/
        ) === null,
      message:
        'Password must contain at least one chess piece',
      infuriationLevel: InfuriationLevel.High,
    },
    {
      passwordIsInvalid: password => password.length % 2 != 0,
      message: 'Password length must be even',
      infuriationLevel: InfuriationLevel.Moderate,
    },
    {
      passwordIsInvalid: password => (password.length % 2 != 0) || ((password.substring(0, (password.length / 2)) != password.substring(password.length / 2, password.length).split("").reverse().join(""))),
      message: 'Password length must be even, and the final half of the password needs to contain the reverse of the first',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    {
      passwordIsInvalid: password => password.length % 2 == 0,
      message: 'Password length must be odd',
      infuriationLevel: InfuriationLevel.Moderate,
    },
    {
      passwordIsInvalid: password => password.match(/[ÁÉÍÓÚáéíóú]/) === null,
      message: 'Password must contain at least 1 character with an acute accent',
      infuriationLevel: InfuriationLevel.Ridiculous,
    },
    // {
    //   passwordIsInvalid: password => password.length > 20,
    //   message: 'Password must not be ' + password.length + ' characters long', TODO: Can't access password here. Might need to make message a function?
    //   infuriationLevel: InfuriationLevel.High,
    // },
  ]

  // Checks that can be used to infuriate the spammer, based on their current password.
  static getValidChecks = password =>
    this.checks.filter(check => check.passwordIsInvalid(password))

  // Randomly choose a check from the "lowest" available infuriation level.
  static infuriate = password => {
    const validChecks = this.getValidChecks(password)
    let leastInfuriatingChecks = []
    if (validChecks.some(c => c.infuriationLevel === InfuriationLevel.Low)) {
      leastInfuriatingChecks = validChecks.filter(
        c => c.infuriationLevel === InfuriationLevel.Low,
      )
    } else if (
      validChecks.some(c => c.infuriationLevel === InfuriationLevel.Moderate)
    ) {
      leastInfuriatingChecks = validChecks.filter(
        c => c.infuriationLevel === InfuriationLevel.Moderate,
      )
    } else if (
      validChecks.some(c => c.infuriationLevel === InfuriationLevel.High)
    ) {
      leastInfuriatingChecks = validChecks.filter(
        c => c.infuriationLevel === InfuriationLevel.High,
      )
    } else if (
      validChecks.some(c => c.infuriationLevel === InfuriationLevel.Ridiculous)
    ) {
      leastInfuriatingChecks = validChecks.filter(
        c => c.infuriationLevel === InfuriationLevel.Ridiculous,
      )
    }

    return leastInfuriatingChecks[
      Math.floor(Math.random() * leastInfuriatingChecks.length)
    ]
  }
}
