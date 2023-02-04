import Income from '../../assets/icons/income.svg'
import ForeignAid from '../../assets/icons/foreign_aid.svg'
import NoForeignAid from '../../assets/icons/no_foreign_aid.svg'
import Coup from '../../assets/icons/coup.svg'
import Steal from '../../assets/icons/steal.svg'
import NoSteal from '../../assets/icons/no_steal.svg'
import Assassinate from '../../assets/icons/assassinate.svg'
import NoAssassinate from '../../assets/icons/no_assassinate.svg'
import Tax from '../../assets/icons/tax.svg'
import Exchange from '../../assets/icons/exchange.svg'

export default {
  Income, ForeignAid, Coup, Steal, Assassinate, Tax, Exchange,
  NoForeignAid, NoSteal, NoAssassinate,
  duke_all: [Tax, NoForeignAid],
  assassin_all: [Assassinate],
  ambassador_all: [Exchange, NoSteal],
  captain_all: [Steal, NoSteal],
  contessa_all: [NoAssassinate],
};
